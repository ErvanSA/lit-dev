import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * Grup radio — membungkus radio native yang di-slot (navigasi panah
 * dikerjakan browser secara native, tetap aksesibel).
 *
 * @example
 * ```html
 * <wec-radio-group value="a">
 *   <input type="radio" name="paket" value="a" /> Paket A
 *   <input type="radio" name="paket" value="b" /> Paket B
 * </wec-radio-group>
 * ```
 *
 * @slot - Elemen `<input type="radio">` native (satu `name` sama).
 * @csspart group - Wadah `role="radiogroup"`.
 * @fires wec-change - Radio berslot berubah (oleh pengguna). detail: `{ value }`.
 */
@customElement('wec-radio-group')
export class WecRadioGroup extends LitElement {
  /** Nilai radio terpilih (set → mencentang radio bernilai sama). */
  @property({ attribute: false })
  get value(): string {
    return this.querySelector<HTMLInputElement>('input[type="radio"]:checked')?.value ?? '';
  }

  set value(v: string) {
    for (const radio of this._radios()) {
      radio.checked = radio.value === v;
    }
  }

  /** Nonaktifkan semua radio berslot. */
  @property({ type: Boolean, reflect: true })
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(v: boolean) {
    const old = this._disabled;
    this._disabled = v;
    this.requestUpdate('disabled', old);
    this._applyDisabled();
  }

  private _disabled = false;

  /** Diisi otomatis oleh `wec-form-field`. */
  @property({ attribute: false }) labelledBy = '';

  /** Diisi otomatis oleh `wec-form-field`. */
  @property({ attribute: false }) describedBy = '';

  /** Jumlah radio yang terdeteksi (pemicu re-render wiring). */
  @state() private _radioCount = 0;

  static override styles = css`
    :host {
      display: block;
    }

    [role='radiogroup'] {
      display: grid;
      gap: var(--wec-space-2);
      font-family: var(--wec-font-family-base);
      font-size: var(--wec-font-size-md);
      line-height: var(--wec-font-line-height-normal);
      color: var(--wec-color-text-default);
    }

    :host([disabled]) [role='radiogroup'] {
      color: var(--wec-color-text-muted);
    }
  `;

  override render() {
    return html`<div
      part="group"
      role="radiogroup"
      aria-labelledby=${this.labelledBy || nothing}
      aria-describedby=${this.describedBy || nothing}
      @change=${this._onChange}
      @slotchange=${this._onSlotChange}
    >
      <slot></slot>
    </div>`;
  }

  override connectedCallback() {
    super.connectedCallback();
    // change dari radio light-DOM (tidak composed) sampai ke host —
    // pendengar di sini, bukan di dalam shadow root.
    this.addEventListener('change', this._onChange);
  }

  override disconnectedCallback() {
    this.removeEventListener('change', this._onChange);
    super.disconnectedCallback();
  }

  protected override updated(): void {
    this._applyDisabled();
  }

  private _radios(): NodeListOf<HTMLInputElement> {
    return this.querySelectorAll<HTMLInputElement>('input[type="radio"]');
  }

  private _applyDisabled(): void {
    for (const radio of this._radios()) {
      radio.disabled = this._disabled;
    }
  }

  private _onSlotChange(): void {
    this._radioCount = this._radios().length;
    this._applyDisabled();
  }

  private _onChange(event: Event): void {
    // Abaikan event dari elemen selain radio berslot (mis. kontrol lain).
    if (!(event.target as HTMLInputElement).matches?.('input[type="radio"]')) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent('wec-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wec-radio-group': WecRadioGroup;
  }
}
