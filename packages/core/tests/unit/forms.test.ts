// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { WecRadioGroup } from '../../src/components/atoms/wec-radio-group/wec-radio-group.js';
import { WecSelect } from '../../src/components/atoms/wec-select/wec-select.js';
import { WecSwitch } from '../../src/components/atoms/wec-switch/wec-switch.js';
import { WecTextarea } from '../../src/components/atoms/wec-textarea/wec-textarea.js';
import { mount } from './helpers.js';

describe('wec-textarea', () => {
  let el: WecTextarea;

  beforeEach(async () => {
    el = await mount('wec-textarea');
  });

  it('default rows = 3', () => {
    expect(el.rows).toBe(3);
    expect(el.shadowRoot!.querySelector('textarea')!.getAttribute('rows')).toBe('3');
  });

  it('mengetik memperbarui value dan memancarkan wec-input', async () => {
    const events: Array<{ value: string }> = [];
    el.addEventListener('wec-input', (e) => events.push((e as CustomEvent).detail));

    const textarea = el.shadowRoot!.querySelector('textarea')!;
    textarea.value = 'catatan';
    textarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.value).toBe('catatan');
    expect(events).toEqual([{ value: 'catatan' }]);
  });

  it('accessible-name menjadi aria-label', async () => {
    el.accessibleName = 'Catatan order';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('textarea')!.getAttribute('aria-label')).toBe(
      'Catatan order',
    );
  });
});

describe('wec-select', () => {
  let el: WecSelect;

  beforeEach(async () => {
    el = await mount('wec-select');
    el.innerHTML = '<option value="bdg">Bandung</option><option value="jkt">Jakarta</option>';
    await el.updateComplete;
  });

  it('perubahan pilihan memancarkan wec-change', async () => {
    const events: Array<{ value: string }> = [];
    el.addEventListener('wec-change', (e) => events.push((e as CustomEvent).detail));

    const select = el.shadowRoot!.querySelector('select')!;
    // CATATAN: setter select.value tidak melihat opsi yang di-slot di happy-dom
    // (di browser asli sesuai spesifikasi flat tree) — tandai opsi langsung.
    const opt = el.querySelector<HTMLOptionElement>('option[value="jkt"]')!;
    opt.selected = true;
    select.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(events.length).toBe(1);
    expect(events[0]!.value).toBe(select.value);
    expect(el.value).toBe(select.value);
  });

  it('meneruskan status ke select internal (required, invalid, disabled, aria)', async () => {
    el.required = true;
    el.invalid = true;
    el.disabled = true;
    el.accessibleName = 'Kota';
    await el.updateComplete;

    const select = el.shadowRoot!.querySelector('select')!;
    expect(select.required).toBe(true);
    expect(select.disabled).toBe(true);
    expect(select.getAttribute('aria-invalid')).toBe('true');
    expect(select.getAttribute('aria-label')).toBe('Kota');
    expect(el.getAttribute('disabled')).not.toBeNull();
  });

  it('placeholder merender option kosong', async () => {
    el.placeholder = 'Pilih kota';
    await el.updateComplete;
    const first = el.shadowRoot!.querySelector('option')!;
    expect(first.textContent!.trim()).toBe('Pilih kota');
    expect(first.hidden).toBe(true);
  });
});

describe('wec-switch', () => {
  let el: WecSwitch;

  beforeEach(async () => {
    el = await mount('wec-switch');
  });

  it('klik toggle checked dan memancarkan wec-change', async () => {
    const events: Array<{ checked: boolean }> = [];
    el.addEventListener('wec-change', (e) => events.push((e as CustomEvent).detail));

    el.shadowRoot!.querySelector('input')!.click();
    await el.updateComplete;

    expect(el.checked).toBe(true);
    expect(events).toEqual([{ checked: true }]);
  });

  it('input internal memakai role=switch + aria-checked', async () => {
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('role')).toBe('switch');
    expect(input.getAttribute('aria-checked')).toBe('false');

    el.checked = true;
    await el.updateComplete;
    expect(input.getAttribute('aria-checked')).toBe('true');
  });

  it('disabled menahan toggle', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('input')!.disabled).toBe(true);
  });
});

describe('wec-radio-group', () => {
  let el: WecRadioGroup;

  beforeEach(async () => {
    el = await mount('wec-radio-group');
    el.innerHTML = `
      <input type="radio" name="paket" value="reguler" />
      <input type="radio" name="paket" value="ekspres" />
    `;
    await el.updateComplete;
  });

  it('wadah internal memakai role=radiogroup', () => {
    expect(el.shadowRoot!.querySelector('[role="radiogroup"]')).not.toBeNull();
  });

  it('set value mencentang radio bernilai sama', async () => {
    el.value = 'ekspres';
    const radios = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(radios[0]?.checked).toBe(false);
    expect(radios[1]?.checked).toBe(true);
    expect(el.value).toBe('ekspres');
  });

  it('perubahan radio berslot memancarkan wec-change', async () => {
    const events: Array<{ value: string }> = [];
    el.addEventListener('wec-change', (e) => events.push((e as CustomEvent).detail));

    const radio = el.querySelectorAll<HTMLInputElement>('input[type="radio"]')[1]!;
    radio.checked = true;
    radio.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    expect(events).toEqual([{ value: 'ekspres' }]);
  });

  it('disabled diteruskan ke semua radio berslot', async () => {
    el.disabled = true;
    await el.updateComplete;
    const radios = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(radios[0]?.disabled).toBe(true);
    expect(radios[1]?.disabled).toBe(true);
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('labelledBy terhubung ke aria-labelledby wadah', async () => {
    el.labelledBy = 'label-123';
    await el.updateComplete;
    expect(
      el.shadowRoot!.querySelector('[role="radiogroup"]')!.getAttribute('aria-labelledby'),
    ).toBe('label-123');
  });
});
