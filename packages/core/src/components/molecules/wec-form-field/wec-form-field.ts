import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

let instanceCount = 0;

/**
 * Pembungkus kontrol form: label + hint/error + slot kontrol.
 *
 * Secara otomatis menghubungkan `aria-labelledby`/`aria-describedby`
 * ke kontrol berslot (dukungan bawaan untuk komponen `wec-*`; kontrol
 * native dihubungkan via atribut `aria-*`).
 *
 * @slot - Kontrol form (`wec-input`, `wec-checkbox`, atau `<input>` native).
 * @csspart label - Elemen `<label>`.
 * @csspart hint - Teks bantuan.
 * @csspart error - Teks error (`role="alert"`).
 * @cssprop --wec-color-text-muted - Warna teks hint/label.
 * @cssprop --wec-color-semantic-danger - Warna teks error dan tanda wajib.
 */
@customElement('wec-form-field')
export class WecFormField extends LitElement {
  /** Teks label. */
  @property() label = '';

  /** Teks bantuan (tidak tampil bila `error` terisi). */
  @property() hint = '';

  /** Teks error (menggantikan hint, diumumkan screen reader). */
  @property() error = '';

  /** Tampilkan tanda bintang wajib. */
  @property({ type: Boolean, reflect: true }) required = false;

  private readonly _labelId = `wec-form-field-label-${++instanceCount}`;
  private readonly _hintId = `wec-form-field-hint-${instanceCount}`;
  private readonly _errorId = `wec-form-field-error-${instanceCount}`;
  private _control: Element | null = null;

  static override styles = css`
    :host {
      display: block;
    }

    .field {
      display: grid;
      gap: var(--wec-space-1);
    }

    label {
      font-family: var(--wec-font-family-base);
      font-size: var(--wec-font-size-sm);
      font-weight: var(--wec-font-weight-medium);
      line-height: var(--wec-font-line-height-normal);
      color: var(--wec-color-text-default);
      cursor: pointer;
    }

    .required {
      color: var(--wec-color-semantic-danger);
    }

    .hint {
      font-size: var(--wec-font-size-xs);
      line-height: var(--wec-font-line-height-normal);
      color: var(--wec-color-text-muted);
    }

    .error {
      font-size: var(--wec-font-size-xs);
      line-height: var(--wec-font-line-height-normal);
      color: var(--wec-color-semantic-danger);
      font-weight: var(--wec-font-weight-medium);
    }
  `;

  override render() {
    return html`<div class="field">
      ${
        this.label
          ? html`<label id=${this._labelId} part="label" @click=${this._focusControl}>
              ${this.label}${
                this.required ? html`<span class="required" aria-hidden="true"> *</span>` : nothing
              }
            </label>`
          : nothing
      }
      <slot @slotchange=${this._onSlotChange}></slot>
      ${
        this.error
          ? html`<div id=${this._errorId} part="error" class="error" role="alert">
              ${this.error}
            </div>`
          : this.hint
            ? html`<div id=${this._hintId} part="hint" class="hint">${this.hint}</div>`
            : nothing
      }
    </div>`;
  }

  protected override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (changed.size > 0) {
      this._wireControl();
    }
  }

  private _onSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this._control = slot.assignedElements({ flatten: true })[0] ?? null;
    this._wireControl();
  }

  /** Hubungkan id label/hint/error ke kontrol berslot. */
  private _wireControl() {
    const control = this._control;
    if (!control) {
      return;
    }

    const describedBy = [
      this.error ? this._errorId : '',
      this.hint && !this.error ? this._hintId : '',
    ]
      .filter(Boolean)
      .join(' ');

    if ('labelledBy' in control) {
      // Kontrol wec-* (shadow DOM): set properti.
      const wecControl = control as unknown as { labelledBy: string; describedBy: string };
      wecControl.labelledBy = this.label ? this._labelId : '';
      wecControl.describedBy = describedBy;
    } else {
      // Kontrol native: set atribut aria.
      if (this.label) {
        control.setAttribute('aria-labelledby', this._labelId);
      } else {
        control.removeAttribute('aria-labelledby');
      }
      if (describedBy) {
        control.setAttribute('aria-describedby', describedBy);
      } else {
        control.removeAttribute('aria-describedby');
      }
    }
  }

  private _focusControl(event: Event) {
    event.preventDefault();
    if (this._control && 'focus' in this._control) {
      (this._control as HTMLElement).focus();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wec-form-field': WecFormField;
  }
}
