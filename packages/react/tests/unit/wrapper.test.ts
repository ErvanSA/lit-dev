// @vitest-environment happy-dom
//
// Render smoke untuk wrapper @wec-ui/react.
//
// CATATAN: penerapan props/event oleh @lit/react memakai layout effect yang
// tidak dapat diverifikasi di happy-dom — verifikasi props & event dilakukan
// lewat panel Actions di Storybook (browser asli) dan pemakaian konsumen.
import * as React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { Badge, Button, Card, Checkbox, FormField, Icon, Input } from '../../src/index.js';

describe('wrapper React (@wec-ui/react) — render smoke', () => {
  function renderIsolated(ui: React.ReactElement): HTMLElement {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
      root.render(ui);
    });
    const el = container.firstElementChild as HTMLElement;
    root.unmount();
    container.remove();
    return el;
  }

  it('semua wrapper terekspor', () => {
    // createComponent mengembalikan komponen React ber-forwardRef (objek).
    expect(Button).toBeDefined();
    expect(Input).toBeDefined();
    expect(Checkbox).toBeDefined();
    expect(Badge).toBeDefined();
    expect(Icon).toBeDefined();
    expect(FormField).toBeDefined();
    expect(Card).toBeDefined();
  });

  it('setiap wrapper merender custom element dengan konten slot', () => {
    const cases: Array<[React.ReactElement, string, string]> = [
      [React.createElement(Button, null, 'Simpan'), 'WEC-BUTTON', 'Simpan'],
      [React.createElement(Input, null), 'WEC-INPUT', ''],
      [React.createElement(Checkbox, null, 'Setuju'), 'WEC-CHECKBOX', 'Setuju'],
      [React.createElement(Badge, null, 'Baru'), 'WEC-BADGE', 'Baru'],
      [React.createElement(Card, null, 'Isi'), 'WEC-CARD', 'Isi'],
      [React.createElement(FormField, null), 'WEC-FORM-FIELD', ''],
    ];
    for (const [ui, tag, text] of cases) {
      const el = renderIsolated(ui);
      expect(el.tagName, tag).toBe(tag);
      if (text) {
        expect(el.textContent, tag).toContain(text);
      }
    }
  });
});
