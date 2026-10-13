import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

/**
 * Switch on/off (`role="switch"`).
 *
 * @slot - Teks label switch.
 * @csspart label - Elemen `<label>` pembungkus.
 * @csspart track - Track switch.
 * @csspart knob - Knob bulat.
 * @fires wec-change - Status berubah. detail: `{ checked }`.
 */
@customElement('wec-switch')
export class WecSwitch extends LitElement {
  /** Status aktif. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Nonaktifkan. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Tandai tidak valid. */
  @property({ type: Boolean, reflect: true }) invalid = false;

  /** `aria-label` bila slot label tidak dipakai. */
  @property({ attribute: 'accessible-name' }) accessibleName = '';

  /** Diisi otomatis oleh `wec-form-field`. */
  @property({ attribute: false }) labelledBy = '';

  /** Diisi otomatis oleh `wec-form-field`. */
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
      position: relative;
      display: inline-block;
      width: var(--wec-size-control-track-w);
      height: var(--wec-size-control-track-h);
      background: var(--wec-color-neutral-300);
      border: 1px solid transparent;
      border-radius: var(--wec-radius-full);
      cursor: pointer;
      transition: background-color 120ms ease;
    }

    input::before {
      content: '';
      position: absolute;
      top: 50%;
      /* 2px = inset struktural knob (bukan skala spacing tema) */
      left: 2px;
      transform: translateY(-50%);
      width: var(--wec-size-control-knob);
      height: var(--wec-size-control-knob);
      border-radius: var(--wec-radius-full);
      background: var(--wec-color-neutral-0);
      box-shadow: var(--wec-shadow-sm);
      transition: translate 120ms ease;
    }

    input:checked {
      background: var(--wec-color-brand-primary);
    }

    input:checked::before {
      /* 4px = inset sisi kanan knob (struktural) */
      translate: calc(var(--wec-size-control-track-w) - var(--wec-size-control-knob) - 4px) 0;
    }

    input:focus-visible {
      outline: 2px solid var(--wec-color-border-focus);
      outline-offset: 2px;
    }

    :host([invalid]) input {
      background: var(--wec-color-semantic-danger);
    }

    :host([disabled]) label,
    :host([disabled]) input {
      cursor: not-allowed;
    }

    :host([disabled]) input {
      opacity: 0.5;
    }
  `;

  override render() {
    return html`<label part="label">
      <input
        part="track"
        type="checkbox"
        role="switch"
        .checked=${this.checked}
        ?disabled=${this.disabled}
        aria-invalid=${this.invalid ? 'true' : 'false'}
        aria-checked=${this.checked ? 'true' : 'false'}
        aria-label=${this.accessibleName || nothing}
        aria-labelledby=${this.labelledBy || nothing}
        aria-describedby=${this.describedBy || nothing}
        @change=${this._onChange}
      />
      <span class="text"><slot></slot></span>
    </label>`;
  }

  /** Fokus ke input internal. */
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
        detail: { checked: this.checked },
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
    'wec-switch': WecSwitch;
  }
}
