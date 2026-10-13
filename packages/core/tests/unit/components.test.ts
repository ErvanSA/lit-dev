// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { WecBadge } from '../../src/components/atoms/wec-badge/wec-badge.js';
import { WecButton } from '../../src/components/atoms/wec-button/wec-button.js';
import { WecCard } from '../../src/components/molecules/wec-card/wec-card.js';
import { WecCheckbox } from '../../src/components/atoms/wec-checkbox/wec-checkbox.js';
import { WecFormField } from '../../src/components/molecules/wec-form-field/wec-form-field.js';
import { WecIcon } from '../../src/components/atoms/wec-icon/wec-icon.js';
import { WecInput } from '../../src/components/atoms/wec-input/wec-input.js';

/** Buat + pasang elemen, tunggu render selesai. */
export async function mount<K extends keyof HTMLElementTagNameMap>(
  tag: K,
): Promise<HTMLElementTagNameMap[K]> {
  const el = document.createElement(tag);
  document.body.appendChild(el);
  await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
  return el;
}

describe('registry komponen', () => {
  it('semua komponen fase 1 terdaftar di customElements', () => {
    expect(customElements.get('wec-badge')).toBe(WecBadge);
    expect(customElements.get('wec-button')).toBe(WecButton);
    expect(customElements.get('wec-card')).toBe(WecCard);
    expect(customElements.get('wec-checkbox')).toBe(WecCheckbox);
    expect(customElements.get('wec-form-field')).toBe(WecFormField);
    expect(customElements.get('wec-icon')).toBe(WecIcon);
    expect(customElements.get('wec-input')).toBe(WecInput);
  });
});

describe('wec-badge', () => {
  let el: WecBadge;

  beforeEach(async () => {
    el = await mount('wec-badge');
  });

  it('varian default neutral dan reflect ke atribut', async () => {
    expect(el.variant).toBe('neutral');
    el.variant = 'danger';
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe('danger');
  });

  it('merender slot ke span part=badge', () => {
    el.textContent = 'Aktif';
    const badge = el.shadowRoot!.querySelector('span')!;
    expect(badge.getAttribute('part')).toBe('badge');
  });
});

describe('wec-icon', () => {
  let el: WecIcon;

  beforeEach(async () => {
    el = await mount('wec-icon');
  });

  it('dekoratif secara default (aria-hidden)', async () => {
    el.name = 'check';
    await el.updateComplete;
    const span = el.shadowRoot!.querySelector('span')!;
    expect(span.getAttribute('aria-hidden')).toBe('true');
  });

  it('dengan label memakai role=img + aria-label', async () => {
    el.name = 'close';
    el.label = 'Tutup';
    await el.updateComplete;
    const span = el.shadowRoot!.querySelector('span')!;
    expect(span.getAttribute('role')).toBe('img');
    expect(span.getAttribute('aria-label')).toBe('Tutup');
  });

  it('nama tak dikenal tidak merender apa pun', async () => {
    el.name = 'tidak-ada' as never;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('span')).toBeNull();
  });
});

describe('wec-button', () => {
  let el: WecButton;

  beforeEach(async () => {
    el = await mount('wec-button');
  });

  it('properti default benar', () => {
    expect(el.variant).toBe('primary');
    expect(el.size).toBe('md');
    expect(el.disabled).toBe(false);
    expect(el.loading).toBe(false);
  });

  it('loading menandai aria-busy pada tombol internal', async () => {
    el.loading = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('button')!.getAttribute('aria-busy')).toBe('true');
    expect(el.shadowRoot!.querySelector('.spinner')).not.toBeNull();
  });

  it('focus() meneruskan ke tombol internal', async () => {
    el.focus();
    expect(el.shadowRoot!.activeElement?.tagName).toBe('BUTTON');
  });
});

describe('wec-input', () => {
  let el: WecInput;

  beforeEach(async () => {
    el = await mount('wec-input');
  });

  it('mengetik memperbarui value dan memancarkan wec-input', async () => {
    const events: Array<{ value: string }> = [];
    el.addEventListener('wec-input', (e) => events.push((e as CustomEvent).detail));

    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'halo';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.value).toBe('halo');
    expect(events).toEqual([{ value: 'halo' }]);
  });

  it('accessible-name menjadi aria-label', async () => {
    el.accessibleName = 'Email kantor';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('input')!.getAttribute('aria-label')).toBe('Email kantor');
  });

  it('invalid menghasilkan aria-invalid', async () => {
    el.invalid = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('input')!.getAttribute('aria-invalid')).toBe('true');
  });
});

describe('wec-checkbox', () => {
  let el: WecCheckbox;

  beforeEach(async () => {
    el = await mount('wec-checkbox');
  });

  it('klik mengubah checked dan memancarkan wec-change', async () => {
    const events: Array<{ checked: boolean }> = [];
    el.addEventListener('wec-change', (e) => events.push((e as CustomEvent).detail));

    el.shadowRoot!.querySelector('input')!.click();
    await el.updateComplete;

    expect(el.checked).toBe(true);
    expect(events).toEqual([{ checked: true, value: 'on' }]);
  });

  it('disabled mencegah perubahan', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('input')!.disabled).toBe(true);
  });
});

describe('wec-form-field', () => {
  it('menghubungkan labelledBy kontrol wec-* ke id label', async () => {
    const field = await mount('wec-form-field');
    field.label = 'Email';
    const input = document.createElement('wec-input');
    field.appendChild(input);
    await field.updateComplete;
    await input.updateComplete;

    const label = field.shadowRoot!.querySelector('label')!;
    expect(input.labelledBy).toBe(label.id);
  });

  it('error menggantikan hint dan terhubung via describedBy', async () => {
    const field = await mount('wec-form-field');
    field.label = 'Email';
    field.hint = 'Gunakan email kantor';
    const input = document.createElement('wec-input');
    field.appendChild(input);
    await field.updateComplete;

    const hintId = field.shadowRoot!.querySelector('.hint')!.id;
    expect(input.describedBy).toBe(hintId);

    field.error = 'Email wajib diisi';
    await field.updateComplete;
    const error = field.shadowRoot!.querySelector('.error')!;
    expect(error.getAttribute('role')).toBe('alert');
    expect(input.describedBy).toBe(error.id);
    expect(field.shadowRoot!.querySelector('.hint')).toBeNull();
  });

  it('kontrol native diberi atribut aria-labelledby', async () => {
    const field = await mount('wec-form-field');
    field.label = 'Nama';
    const native = document.createElement('input');
    field.appendChild(native);
    await field.updateComplete;

    const label = field.shadowRoot!.querySelector('label')!;
    expect(native.getAttribute('aria-labelledby')).toBe(label.id);
  });
});

describe('wec-card', () => {
  it('interactive reflect ke atribut', async () => {
    const card = await mount('wec-card');
    card.interactive = true;
    await card.updateComplete;
    expect(card.hasAttribute('interactive')).toBe(true);
  });

  it('memiliki tiga slot', async () => {
    const card = document.createElement('wec-card');
    document.body.appendChild(card);
    await card.updateComplete;
    const slots = card.shadowRoot!.querySelectorAll('slot');
    expect(slots.length).toBe(3);
  });
});
