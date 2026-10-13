import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateIcons, sanitizeSvg, toIconName } from '../generate.mjs';

describe('generator ikon', () => {
  it('toIconName menghasilkan kebab-case', () => {
    expect(toIconName('Arrow Right.svg')).toBe('arrow-right');
    expect(toIconName('Check_Circle.SVG')).toBe('check-circle');
    expect(toIconName('check.svg')).toBe('check');
  });

  it('sanitizeSvg membuang XML declaration, DOCTYPE, dan komentar', () => {
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- komentar desainer -->
<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>`;
    expect(sanitizeSvg(input)).toBe('<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>');
  });

  it('generateIcons menulis registry TS dari folder SVG', () => {
    const dir = mkdtempSync(join(tmpdir(), 'wec-icons-'));
    const outFile = join(dir, 'registry.ts');
    try {
      writeFileSync(join(dir, 'Send Icon.svg'), '<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>');
      const names = generateIcons({ srcDir: dir, outFile });
      expect(names).toEqual(['send-icon']);
      const content = readFileSync(outFile, 'utf8');
      expect(content).toContain("export type WecIconName = 'send-icon'");
      expect(content).toContain(`'send-icon':`);
      expect(content).toContain('<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('generateIcons menolak nama duplikat', () => {
    const dir = mkdtempSync(join(tmpdir(), 'wec-icons-'));
    try {
      writeFileSync(join(dir, 'check 1.svg'), '<svg/>');
      writeFileSync(join(dir, 'check-1.svg'), '<svg/>');
      expect(() => generateIcons({ srcDir: dir, outFile: join(dir, 'registry.ts') })).toThrow(
        /duplikat/,
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
