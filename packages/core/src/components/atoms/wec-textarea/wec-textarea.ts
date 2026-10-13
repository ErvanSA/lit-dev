import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

/**
 * Area teks multiline.
 *
 * Gunakan bersama `wec-form-field` untuk label + hint + error (wiring ARIA
 * otomatis). Properti `rows` mengatur tinggi awal.
 *
 * @csspart textarea - Elemen `<textarea>` internal.
 * @cssprop --wec-color-border-* - Warna border.
 * @cssprop --wec-radius-md - Radius sudut.
 * @fires wec-input - Nilai berubah saat mengetik. detail: `{ value }`.
 * @fires wec-change - Nilai commit (blur). detail: `{ value }`.
 * @fires wec-blur - Kehilangan fokus.
 * @fires wec-focus - Mendapat fokus.
 */
@customElement('wec-textarea')
export class WecTextarea extends LitElement {
  /** Nilai textarea. */
  @property() value = '';

  /** Teks placeholder. */
  @property() placeholder = '';

  /** Jumlah baris terlihat. */
  @property({ type: Number }) rows = 3;

  /** Nonaktifkan. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Mode baca-saja. */
  @property({ type: Boolean, reflect: true }) readonly = false;

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

    textarea {
      width: 100%;
      box-sizing: border-box;
      resize: vertical;
      display: block;
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

    textarea::placeholder {
      color: var(--wec-color-text-muted);
    }

    :host(:not([disabled])) textarea:hover {
      border-color: var(--wec-color-border-strong);
    }

    textarea:focus-visible {
      outline: 2px solid var(--wec-color-border-focus);
      outline-offset: 0;
    }

    :host([invalid]) textarea {
      border-color: var(--wec-color-semantic-danger);
    }

    :host([invalid]) textarea:focus-visible {
      outline-color: var(--wec-color-semantic-danger);
    }

    :host([readonly]) textarea {
      background: var(--wec-color-background-subtle);
    }

    :host([disabled]) textarea {
      background: var(--wec-color-background-subtle);
      color: var(--wec-color-text-muted);
      cursor: not-allowed;
      opacity: 0.7;
    }
  `;

  override render() {
    return html`<textarea
      part="textarea"
      .value=${this.value}
      placeholder=${this.placeholder}
      rows=${this.rows}
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
    ></textarea>`;
  }

  /** Fokus ke `<textarea>` internal. */
  override focus(options?: FocusOptions) {
    this._textarea.focus(options);
  }

  override blur() {
    this._textarea.blur();
  }

  private _onInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.dispatchEvent(
      new CustomEvent('wec-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
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

  @query('textarea')
  private _textarea!: HTMLTextAreaElement;
}

declare global {
  interface HTMLElementTagNameMap {
    'wec-textarea': WecTextarea;
  }
}
