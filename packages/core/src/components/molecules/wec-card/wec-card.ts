import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Wadah konten (kartu) dengan slot `header`, default, dan `footer`.
 *
 * @slot - Isi utama kartu.
 * @slot header - Judul kartu (heading dibawa konsumen, mis. `<h3>`).
 * @slot footer - Aksi/kaki kartu.
 * @csspart card - Wadah kartu.
 * @cssprop --wec-radius-lg - Radius kartu.
 * @cssprop --wec-shadow-sm/md - Bayangan kartu.
 * @cssprop --wec-color-border-subtle - Warna border.
 */
@customElement('wec-card')
export class WecCard extends LitElement {
  /** Tambah gaya hover/press untuk kartu yang bisa diklik. */
  @property({ type: Boolean, reflect: true }) interactive = false;

  static override styles = css`
    :host {
      display: block;
    }

    .card {
      display: grid;
      gap: var(--wec-space-4);
      box-sizing: border-box;
      padding: var(--wec-space-6);
      background: var(--wec-color-background-default);
      border: 1px solid var(--wec-color-border-subtle);
      border-radius: var(--wec-radius-lg);
      box-shadow: var(--wec-shadow-sm);
    }

    :host([interactive]) .card {
      cursor: pointer;
      transition:
        box-shadow 120ms ease,
        border-color 120ms ease;
    }

    :host([interactive]) .card:hover {
      box-shadow: var(--wec-shadow-md);
      border-color: var(--wec-color-border-default);
    }

    :host([interactive]) .card:active {
      box-shadow: var(--wec-shadow-sm);
    }

    slot[name='header']::slotted(*) {
      margin: 0;
      font-family: var(--wec-font-family-base);
      font-size: var(--wec-font-size-lg);
      font-weight: var(--wec-font-weight-semibold);
      line-height: var(--wec-font-line-height-tight);
      color: var(--wec-color-text-default);
    }

    slot[name='footer']::slotted(*) {
      display: flex;
      gap: var(--wec-space-2);
      align-items: center;
    }
  `;

  override render() {
    return html`<div part="card" class="card">
      <slot name="header"></slot>
      <slot></slot>
      <slot name="footer"></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wec-card': WecCard;
  }
}
