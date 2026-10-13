import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

/**
 * Checkbox dengan label dari slot.
 *
 * @slot - Teks label checkbox.
 * @csspart label - Elemen `<label>` pembungkus.
 * @csspart box - Checkbox visual (`appearance: none` pada input asli).
 * @cssprop --wec-color-brand-primary - Warna saat tercentang.
 * @cssprop --wec-size-icon-sm - Ukuran kotak checkbox.
 * @fires wec-change - Status berubah. detail: `{ checked, value }`.
 */
@customElement('wec-checkbox')
export class WecCheckbox extends LitElement {
  /** Status tercentang. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Nonaktifkan checkbox. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Tandai status tidak valid (border merah + `aria-invalid`). */
  @property({ type: Boolean, reflect: true }) invalid = false;

  /** Nilai yang dilaporkan dalam detail event. */
  @property() value = 'on';

  /** `aria-label` bila slot label tidak dipakai. */
  @property({ attribute: 'accessible-name' }) accessibleName = '';

  /** Diisi otomatis oleh `wec-form-field` (id label). */
  @property({ attribute: false }) labelledBy = '';

  /** Diisi otomatis oleh `wec-form-field` (id hint/error). */
  @property({ attribute: false }) describedBy = '';

  static override styles = css`
    :host {
      display: inline-flex;
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: var(--wec-space-2);
      cursor: pointer;
      font-family: var(--wec-font-family-base);
      font-size: var(--wec-font-size-md);
      line-height: var(--wec-font-line-height-normal);
      color: var(--wec-color-text-default);
    }

    input {
      appearance: none;
      box-sizing: border-box;
      margin: 0;
      flex: none;
      display: inline-grid;
      place-content: center;
      width: var(--wec-size-icon-sm);
      height: var(--wec-size-icon-sm);
      background: var(--wec-color-background-default);
      border: 1px solid var(--wec-color-border-strong);
      border-radius: var(--wec-radius-sm);
      cursor: pointer;
      transition:
        background-color 120ms ease,
        border-color 120ms ease;
    }

    input::before {
      content: '';
      width: 60%;
      aspect-ratio: 1;
      background-color: var(--wec-color-brand-on-primary);
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      transform: scale(0);
      transition: transform 120ms ease;
    }

    input:checked {
      background: var(--wec-color-brand-primary);
      border-color: var(--wec-color-brand-primary);
    }

    input:checked::before {
      transform: scale(1);
    }

    input:focus-visible {
      outline: 2px solid var(--wec-color-border-focus);
      outline-offset: 2px;
    }

    :host([invalid]) input {
      border-color: var(--wec-color-semantic-danger);
    }

    :host([invalid]) input:focus-visible {
      outline-color: var(--wec-color-semantic-danger);
    }

    :host([disabled]) {
      cursor: not-allowed;
    }

    :host([disabled]) label {
      cursor: not-allowed;
      color: var(--wec-color-text-muted);
    }

    :host([disabled]) input {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `;

  override render() {
    return html`<label part="label">
      <input
        part="box"
        type="checkbox"
        .checked=${this.checked}
        .value=${this.value}
        ?disabled=${this.disabled}
        aria-invalid=${this.invalid ? 'true' : 'false'}
        aria-label=${this.accessibleName || nothing}
        aria-labelledby=${this.labelledBy || nothing}
        aria-describedby=${this.describedBy || nothing}
        @change=${this._onChange}
      />
      <span class="text"><slot></slot></span>
    </label>`;
  }

  /** Fokus ke checkbox internal. */
  override focus(options?: FocusOptions) {
    this._input.focus(options);
  }

  override blur() {
    this._input.blur();
  }

  private _onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.dispatchEvent(
      new CustomEvent('wec-change', {
        detail: { checked: this.checked, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  @query('input')
  private _input!: HTMLInputElement;
}

declare global {
  interface HTMLElementTagNameMap {
    'wec-checkbox': WecCheckbox;
  }
}
