import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

export type WecButtonVariant = 'primary' | 'outline';

/**
 * Tombol design system wec-ui (brand Telkomsel).
 *
 * Varian:
 * - `primary` — latar merah Telkomsel, teks putih.
 * - `outline` — latar putih, border + teks merah Telkomsel.
 *
 * `disabled` adalah state (bukan varian): latar abu, teks abu, non-interaktif.
 *
 * @slot - Konten tombol (teks).
 * @csspart button - Elemen `<button>` internal.
 * @cssprop --wec-color-brand-primary - Warna latar varian `primary`.
 * @cssprop --wec-color-brand-primary-hover - Warna hover varian `primary`.
 * @cssprop --wec-color-brand-primary-tint - Warna hover varian `outline`.
 * @cssprop --wec-size-control-height - Tinggi minimum tombol.
 * @fires click - Event klik native (composed) dari `<button>` internal.
 */
@customElement('wec-button')
export class WecButton extends LitElement {
  /** Varian visual tombol. */
  @property({ reflect: true }) variant: WecButtonVariant = 'primary';

  /** Nonaktifkan interaksi tombol. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  static readonly styles = css`
    :host {
      display: inline-block;
    }

    button {
      display: inline-flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      min-height: var(--wec-size-control-height);
      padding-inline: var(--wec-space-8);
      border: 2px solid transparent;
      border-radius: var(--wec-radius-full);
      font-family: var(--wec-font-family-bold);
      font-size: var(--wec-font-size-lg);
      line-height: var(--wec-font-line-height-normal);
      white-space: nowrap;
      cursor: pointer;
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        color 120ms ease;
    }

    :host(:not([disabled])) button:focus-visible {
      outline: 2px solid var(--wec-color-border-focus);
      outline-offset: 2px;
    }

    /* Varian primary */
    :host([variant='primary']) button {
      background: var(--wec-color-brand-primary);
      color: var(--wec-color-brand-on-primary);
    }
    :host([variant='primary']:not([disabled])) button:hover {
      background: var(--wec-color-brand-primary-hover);
    }
    :host([variant='primary']:not([disabled])) button:active {
      background: var(--wec-color-semantic-danger-hover);
    }

    /* Varian outline */
    :host([variant='outline']) button {
      background: var(--wec-color-background-default);
      color: var(--wec-color-brand-primary);
      border-color: var(--wec-color-brand-primary);
    }
    :host([variant='outline']:not([disabled])) button:hover {
      background: var(--wec-color-brand-primary-tint);
    }
    :host([variant='outline']:not([disabled])) button:active {
      background: var(--wec-color-brand-primary-tint);
      color: var(--wec-color-semantic-danger-hover);
      border-color: var(--wec-color-semantic-danger-hover);
    }

    /* State disabled */
    :host([disabled]) button {
      background: var(--wec-color-background-disabled);
      color: var(--wec-color-text-disabled);
      border-color: transparent;
      cursor: not-allowed;
    }
  `;

  override render() {
    return html`<button part="button" type="button" ?disabled=${this.disabled}>
      <slot></slot>
    </button>`;
  }

  /** Fokus ke `<button>` internal (dipakai label luar / programatik). */
  override focus(options?: FocusOptions) {
    this._button.focus(options);
  }

  override blur() {
    this._button.blur();
  }

  @query('button')
  private readonly _button!: HTMLButtonElement;
}

declare global {
  interface HTMLElementTagNameMap {
    'wec-button': WecButton;
  }
}
