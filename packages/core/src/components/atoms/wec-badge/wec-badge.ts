import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type WecBadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

/**
 * Label status kecil (badge/pill).
 *
 * @slot - Teks badge.
 * @csspart badge - Elemen `<span>` internal.
 * @cssprop --wec-radius-full - Radius pill.
 * @cssprop --wec-color-neutral-* - Warna varian `neutral`.
 * @cssprop --wec-color-semantic-* - Warna varian `success`/`warning`/`danger`.
 */
@customElement('wec-badge')
export class WecBadge extends LitElement {
  /** Varian warna badge. */
  @property({ reflect: true }) variant: WecBadgeVariant = 'neutral';

  static override styles = css`
    :host {
      display: inline-block;
    }

    span {
      display: inline-flex;
      align-items: center;
      gap: var(--wec-space-1);
      padding: var(--wec-space-1) var(--wec-space-2);
      border-radius: var(--wec-radius-full);
      font-family: var(--wec-font-family-base);
      font-size: var(--wec-font-size-xs);
      font-weight: var(--wec-font-weight-medium);
      line-height: var(--wec-font-line-height-tight);
      white-space: nowrap;
    }

    :host([variant='neutral']) span {
      background: var(--wec-color-neutral-200);
      color: var(--wec-color-text-default);
    }

    :host([variant='brand']) span {
      background: var(--wec-color-brand-primary);
      color: var(--wec-color-brand-on-primary);
    }

    :host([variant='success']) span {
      background: var(--wec-color-semantic-success);
      color: var(--wec-color-semantic-on-success);
    }

    :host([variant='warning']) span {
      background: var(--wec-color-semantic-warning);
      color: var(--wec-color-semantic-on-warning);
    }

    :host([variant='danger']) span {
      background: var(--wec-color-semantic-danger);
      color: var(--wec-color-semantic-on-danger);
    }
  `;

  override render() {
    return html`<span part="badge"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wec-badge': WecBadge;
  }
}
