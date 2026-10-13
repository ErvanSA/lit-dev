import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

export type WecButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type WecButtonSize = 'sm' | 'md' | 'lg';

/**
 * Tombol dasar design system wec-ui.
 *
 * @slot - Konten tombol (teks, atau ikon + teks).
 * @slot icon-start - Ikon di awal (sebelum teks).
 * @slot icon-end - Ikon di akhir (setelah teks).
 * @csspart button - Elemen `<button>` internal.
 * @cssprop --wec-color-brand-primary - Warna latar varian `primary`.
 * @cssprop --wec-color-semantic-danger - Warna latar varian `danger`.
 * @cssprop --wec-radius-md - Radius sudut tombol.
 * @cssprop --wec-space-* - Skala padding internal.
 * @fires click - Event klik native (composed) dari `<button>` internal.
 */
@customElement('wec-button')
export class WecButton extends LitElement {
  /** Varian visual tombol. */
  @property({ reflect: true }) variant: WecButtonVariant = 'primary';

  /** Ukuran tombol. */
  @property({ reflect: true }) size: WecButtonSize = 'md';

  /** Nonaktifkan interaksi tombol. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Tampilkan spinner dan tahan interaksi (proses berjalan). */
  @property({ type: Boolean, reflect: true }) loading = false;

  static override styles = css`
    :host {
      display: inline-block;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--wec-space-2);
      border: 1px solid transparent;
      border-radius: var(--wec-radius-md);
      font-family: var(--wec-font-family-base);
      font-weight: var(--wec-font-weight-medium);
      line-height: var(--wec-font-line-height-normal);
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

    /* Ukuran */
    :host([size='sm']) button {
      font-size: var(--wec-font-size-sm);
      padding: var(--wec-space-1) var(--wec-space-3);
    }
    :host([size='md']) button {
      font-size: var(--wec-font-size-md);
      padding: var(--wec-space-2) var(--wec-space-4);
    }
    :host([size='lg']) button {
      font-size: var(--wec-font-size-lg);
      padding: var(--wec-space-3) var(--wec-space-6);
    }

    /* Varian */
    :host([variant='primary']) button {
      background: var(--wec-color-brand-primary);
      color: var(--wec-color-brand-on-primary);
    }
    :host([variant='primary']:not([disabled])) button:hover {
      background: var(--wec-color-brand-primary-hover);
    }

    :host([variant='secondary']) button {
      background: var(--wec-color-background-subtle);
      color: var(--wec-color-text-default);
      border-color: var(--wec-color-border-default);
    }
    :host([variant='secondary']:not([disabled])) button:hover {
      background: var(--wec-color-background-subtle-hover);
    }

    :host([variant='ghost']) button {
      background: transparent;
      color: var(--wec-color-text-default);
    }
    :host([variant='ghost']:not([disabled])) button:hover {
      background: var(--wec-color-background-subtle);
    }

    :host([variant='danger']) button {
      background: var(--wec-color-semantic-danger);
      color: var(--wec-color-semantic-on-danger);
    }
    :host([variant='danger']:not([disabled])) button:hover {
      background: var(--wec-color-semantic-danger-hover);
    }

    /* Spinner saat loading */
    .spinner {
      width: 1em;
      height: 1em;
      flex: none;
      border: 2px solid currentcolor;
      border-right-color: transparent;
      border-radius: var(--wec-radius-full);
      animation: wec-spin 600ms linear infinite;
    }

    @keyframes wec-spin {
      to {
        transform: rotate(360deg);
      }
    }

    :host([loading]) button {
      pointer-events: none;
      opacity: 0.7;
    }

    :host([disabled]) button {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
  `;

  override render() {
    return html`<button
      part="button"
      type="button"
      ?disabled=${this.disabled || this.loading}
      aria-busy=${this.loading ? 'true' : nothing}
    >
      ${this.loading ? html`<span class="spinner" aria-hidden="true"></span>` : nothing}
      <slot name="icon-start"></slot>
      <slot></slot>
      <slot name="icon-end"></slot>
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
  private _button!: HTMLButtonElement;
}

declare global {
  interface HTMLElementTagNameMap {
    'wec-button': WecButton;
  }
}
