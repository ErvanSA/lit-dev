import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

export type WecInputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

/**
 * Input teks satu baris.
 *
 * Label, hint, dan error ditangani `wec-form-field`; bila dipakai tanpa
 * form-field, berikan `accessible-name` untuk aksesibilitas.
 *
 * @csspart input - Elemen `<input>` internal.
 * @cssprop --wec-color-border-* - Warna border (default/strong/focus).
 * @cssprop --wec-color-background-* - Warna latar input.
 * @cssprop --wec-radius-md - Radius sudut.
 * @cssprop --wec-space-* - Padding internal.
 * @fires wec-input - Nilai berubah saat mengetik. detail: `{ value }`.
 * @fires wec-change - Nilai berubah dan commit (blur/enter). detail: `{ value }`.
 * @fires wec-blur - Input kehilangan fokus.
 * @fires wec-focus - Input mendapat fokus.
 */
@customElement('wec-input')
export class WecInput extends LitElement {
  /** Tipe input HTML. */
  @property({ reflect: true }) type: WecInputType = 'text';

  /** Nilai input. */
  @property() value = '';

  /** Teks placeholder. */
  @property() placeholder = '';

  /** Nonaktifkan input. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Mode baca-saja. */
  @property({ type: Boolean, reflect: true }) readonly = false;

  /** Wajib diisi (validasi native). */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Tandai status tidak valid (border merah + `aria-invalid`). */
  @property({ type: Boolean, reflect: true }) invalid = false;

  /** `aria-label` untuk pemakaian tanpa `wec-form-field`. */
  @property({ attribute: 'accessible-name' }) accessibleName = '';

  /** Diisi otomatis oleh `wec-form-field` (id label). */
  @property({ attribute: false }) labelledBy = '';

  /** Diisi otomatis oleh `wec-form-field` (id hint/error). */
  @property({ attribute: false }) describedBy = '';

  static override styles = css`
    :host {
      display: block;
    }

    input {
      width: 100%;
      box-sizing: border-box;
      font-family: var(--wec-font-family-base);
      font-size: var(--wec-font-size-md);
      line-height: var(--wec-font-line-height-normal);
      color: var(--wec-color-text-default);
      background: var(--wec-color-background-default);
      border: 1px solid var(--wec-color-border-default);
      border-radius: var(--wec-radius-md);
      padding: var(--wec-space-2) var(--wec-space-3);
      transition:
        border-color 120ms ease,
        background-color 120ms ease;
    }

    input::placeholder {
      color: var(--wec-color-text-muted);
    }

    :host(:not([disabled])) input:hover {
      border-color: var(--wec-color-border-strong);
    }

    input:focus-visible {
      outline: 2px solid var(--wec-color-border-focus);
      outline-offset: 0;
    }

    :host([invalid]) input {
      border-color: var(--wec-color-semantic-danger);
    }

    :host([invalid]) input:focus-visible {
      outline-color: var(--wec-color-semantic-danger);
    }

    :host([readonly]) input {
      background: var(--wec-color-background-subtle);
    }

    :host([disabled]) input {
      background: var(--wec-color-background-subtle);
      color: var(--wec-color-text-muted);
      cursor: not-allowed;
      opacity: 0.7;
    }
  `;

  override render() {
    return html`<input
      part="input"
      .value=${this.value}
      type=${this.type}
      placeholder=${this.placeholder}
      ?disabled=${this.disabled}
      ?readonly=${this.readonly}
      ?required=${this.required}
      aria-invalid=${this.invalid ? 'true' : 'false'}
      aria-label=${this.accessibleName || nothing}
      aria-labelledby=${this.labelledBy || nothing}
      aria-describedby=${this.describedBy || nothing}
      @input=${this._onInput}
      @change=${this._onChange}
      @focus=${this._onFocus}
      @blur=${this._onBlur}
    />`;
  }

  /** Fokus ke `<input>` internal (dipakai label `wec-form-field`). */
  override focus(options?: FocusOptions) {
    this._input.focus(options);
  }

  override blur() {
    this._input.blur();
  }

  private _onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent('wec-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
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

  @query('input')
  private _input!: HTMLInputElement;
}

declare global {
  interface HTMLElementTagNameMap {
    'wec-input': WecInput;
  }
}
