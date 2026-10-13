import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { icons, type WecIconName } from '../icon/registry.js';

export type WecIconSize = 'sm' | 'md' | 'lg';

/**
 * Ikon dari registry SVG internal (lihat `tools/icons`).
 *
 * Sifatnya dekoratif secara default (`aria-hidden`); berikan prop `label`
 * untuk menjadikannya bergambar bermakna (`role="img"`).
 *
 * @csspart icon - Wadah `<span>` berisi markup SVG.
 * @cssprop --wec-size-icon-sm - Ukuran ikon `sm`.
 * @cssprop --wec-size-icon-md - Ukuran ikon `md` (default).
 * @cssprop --wec-size-icon-lg - Ukuran ikon `lg`.
 */
@customElement('wec-icon')
export class WecIcon extends LitElement {
  /** Nama ikon di registry (hasil generator `tools/icons`). */
  @property() name?: WecIconName;

  /** Ukuran ikon (dipetakan ke token `--wec-size-icon-*`). */
  @property({ reflect: true }) size: WecIconSize = 'md';

  /** Label aksesibilitas. Kosong = dekoratif. */
  @property() label = '';

  static override styles = css`
    :host {
      display: inline-flex;
    }

    span {
      display: inline-flex;
      width: var(--wec-icon-size);
      height: var(--wec-icon-size);
    }

    :host([size='sm']) span {
      --wec-icon-size: var(--wec-size-icon-sm);
    }
    :host([size='md']) span {
      --wec-icon-size: var(--wec-size-icon-md);
    }
    :host([size='lg']) span {
      --wec-icon-size: var(--wec-size-icon-lg);
    }

    span svg {
      width: 100%;
      height: 100%;
    }
  `;

  override render() {
    const svg = this.name ? icons[this.name] : undefined;
    if (!svg) {
      return nothing;
    }
    return this.label
      ? html`<span part="icon" role="img" aria-label=${this.label} .innerHTML=${svg}></span>`
      : html`<span part="icon" aria-hidden="true" .innerHTML=${svg}></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wec-icon': WecIcon;
  }
}
