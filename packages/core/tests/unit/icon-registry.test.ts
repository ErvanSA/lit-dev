import { describe, expect, it } from 'vitest';
import { icons } from '../../src/components/atoms/icon/registry.js';

describe('icon registry', () => {
  it('berisi minimal satu ikon', () => {
    expect(Object.keys(icons).length).toBeGreaterThan(0);
  });

  it('setiap entri adalah markup SVG bersih dengan nama kebab-case', () => {
    for (const [name, svg] of Object.entries(icons)) {
      expect(svg).toMatch(/^<svg/);
      expect(svg).not.toContain('<?xml');
      expect(svg).not.toContain('<!--');
      expect(name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});
