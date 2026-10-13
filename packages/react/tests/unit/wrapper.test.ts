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
import { Button } from '../../src/index.js';

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

  it('wrapper Button terekspor', () => {
    // createComponent mengembalikan komponen React ber-forwardRef (objek).
    expect(Button).toBeDefined();
  });

  it('Button merender <wec-button> dengan konten slot', () => {
    const el = renderIsolated(React.createElement(Button, null, 'Ganti Nomor'));
    expect(el.tagName).toBe('WEC-BUTTON');
    expect(el.textContent).toContain('Ganti Nomor');
  });
});
