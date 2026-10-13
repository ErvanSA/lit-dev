import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

/**
 * Dropdown pilihan — membungkus `<select>` native; opsi ditulis sebagai
 * `<option>` di light DOM (tetap native dan aksesibel).
 *
 * @example
 * ```html
 * <wec-select placeholder="Pilih kota">
 *   <option value="bdg">Bandung</option>
 *   <option value="jkt">Jakarta</option>
 * </wec-select>
 * ```
 *
 * @slot - Elemen `<option>` / `<optgroup>`.
 * @csspart select - Elemen `<select>` internal.
 * @fires wec-change - Pilihan berubah. detail: `{ value }`.
 * @fires wec-blur - Kehilangan fokus.
 * @fires wec-focus - Mendapat fokus.
 */
@customElement('wec-select')
export class WecSelect extends LitElement {
  /** Nilai terpilih. */
  @property() value = '';

  /** Opsi kosong sementara (muncul sebelum ada pilihan). */
  @property() placeholder = '';

  /** Nonaktifkan. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Wajib diisi. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Tandai tidak valid. */
  @property({ type: Boolean, reflect: true }) invalid = false;

  /** `aria-label` untuk pemakaian tanpa `wec-form-field`. */
  @property({ attribute: 'accessible-name' }) accessibleName = '';

  /** Diisi otomatis oleh `wec-form-field`. */
  @property({ attribute: false }) labelledBy = '';

  /** Diisi otomatis oleh `wec-form-field`. */
  @property({ attribute: false }) describedBy = '';

  static override styles = css`
    :host {
      display: block;
    }

    select {
      width: 100%;
      box-sizing: border-box;
      appearance: none;
      display: block;
      font-family: var(--wec-font-family-base);
      font-size: var(--wec-font-size-md);
      line-height: var(--wec-font-line-height-normal);
      color: var(--wec-color-text-default);
      background-color: var(--wec-color-background-default);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237c7c8c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right var(--wec-space-3) center;
      background-size: var(--wec-size-icon-sm);
      border: 1px solid var(--wec-color-border-default);
      border-radius: var(--wec-radius-md);
      padding: var(--wec-space-2) var(--wec-space-8) var(--wec-space-2) var(--wec-space-3);
      cursor: pointer;
      transition:
        border-color 120ms ease,
        background-color 120ms ease;
    }

    select:required:invalid {
      color: var(--wec-color-text-muted);
    }

    :host(:not([disabled])) select:hover {
      border-color: var(--wec-color-border-strong);
    }

    select:focus-visible {
      outline: 2px solid var(--wec-color-border-focus);
      outline-offset: 0;
    }

    :host([invalid]) select {
      border-color: var(--wec-color-semantic-danger);
    }

    :host([invalid]) select:focus-visible {
      outline-color: var(--wec-color-semantic-danger);
    }

    :host([disabled]) select {
      background-color: var(--wec-color-background-subtle);
      color: var(--wec-color-text-muted);
      cursor: not-allowed;
      opacity: 0.7;
    }
  `;

  override render() {
    return html`<select
      part="select"
      .value=${this.value}
      ?disabled=${this.disabled}
      ?required=${this.required}
      aria-invalid=${this.invalid ? 'true' : 'false'}
      aria-label=${this.accessibleName || nothing}
      aria-labelledby=${this.labelledBy || nothing}
      aria-describedby=${this.describedBy || nothing}
      @change=${this._onChange}
      @focus=${this._onFocus}
      @blur=${this._onBlur}
    >
      ${
        this.placeholder
          ? html`<option value="" ?disabled=${this.required} ?selected=${!this.value} hidden>
              ${this.placeholder}
            </option>`
          : nothing
      }
      <slot></slot>
    </select>`;
  }

  /** Fokus ke `<select>` internal. */
  override focus(options?: FocusOptions) {
    this._select.focus(options);
  }

  override blur() {
    this._select.blur();
  }

  private _onChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.value = select.value;
    this.dispatchEvent(
      new CustomEvent('wec-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onFocus() {
    this.dispatchEvent(new CustomEvent('wec-focus', { bubbles: true, composed: true }));
  }

  private _onBlur() {
    this.dispatchEvent(new CustomEvent('wec-blur', { bubbles: true, composed: true }));
  }

  @query('select')
  private _select!: HTMLSelectElement;
}

declare global {
  interface HTMLElementTagNameMap {
    'wec-select': WecSelect;
  }
}
