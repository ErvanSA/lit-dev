// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { WecButton } from '../../src/components/atoms/wec-button/wec-button.js';

/** Buat + pasang elemen, tunggu render selesai. */
async function mount(): Promise<WecButton> {
  const el = document.createElement('wec-button');
  el.textContent = 'Ganti Nomor';
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('wec-button (brand Telkomsel)', () => {
  let el: WecButton;

  beforeEach(async () => {
    el = await mount();
  });

  it('varian default primary dan reflect ke atribut', async () => {
    expect(el.variant).toBe('primary');
    el.variant = 'outline';
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe('outline');
  });

  it('merender slot + button internal part=button', () => {
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.getAttribute('part')).toBe('button');
    // Konten slot = light DOM host; button internal memuat <slot>.
    expect(el.textContent).toContain('Ganti Nomor');
    expect(btn.querySelector('slot')).not.toBeNull();
  });

  it('disabled: atribut reflect + button internal nonaktif + klik tertahan', async () => {
    const clicks: number[] = [];
    el.addEventListener('click', () => clicks.push(1));

    el.disabled = true;
    await el.updateComplete;

    expect(el.hasAttribute('disabled')).toBe(true);
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.disabled).toBe(true);
    btn.click();
    expect(clicks).toHaveLength(0);
  });

  it('klik pada button internal sampai ke host (composed)', async () => {
    const clicks: number[] = [];
    el.addEventListener('click', () => clicks.push(1));
    el.shadowRoot!.querySelector('button')!.click();
    expect(clicks).toHaveLength(1);
  });

  it('focus() meneruskan ke button internal', () => {
    el.focus();
    expect(el.shadowRoot!.activeElement?.tagName).toBe('BUTTON');
  });

  it('type button internal selalu button (bukan submit)', () => {
    expect(el.shadowRoot!.querySelector('button')!.getAttribute('type')).toBe('button');
  });
});
