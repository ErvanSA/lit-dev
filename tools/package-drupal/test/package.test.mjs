import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { assembleDrupalPackage } from '../package.mjs';

describe('assembler paket Drupal', () => {
  it('menyalin js/css, menghasilkan libraries.yml + composer.json', () => {
    const base = mkdtempSync(join(tmpdir(), 'wec-drupal-'));
    const coreDir = join(base, 'dist');
    const outDir = join(base, 'out', 'wec_ui');
    try {
      // Fake dist core.
      mkdirSync(join(coreDir, 'define'), { recursive: true });
      mkdirSync(join(coreDir, 'components', 'atoms'), { recursive: true });
      writeFileSync(join(coreDir, 'define', 'wec-button.js'), 'define-button');
      writeFileSync(join(coreDir, 'define', 'wec-input.js'), 'define-input');
      writeFileSync(join(coreDir, 'components', 'atoms', 'chunk.js'), 'chunk');
      writeFileSync(join(coreDir, 'index.d.ts'), 'types');
      writeFileSync(join(coreDir, 'tokens.css'), ':root{}');

      const defines = assembleDrupalPackage({
        coreDir,
        tokensCss: join(coreDir, 'tokens.css'),
        outDir,
        version: '1.2.3',
      });

      expect(defines).toEqual(['wec-button.js', 'wec-input.js']);

      // JS tersalin, deklarasi TS tidak.
      expect(existsSync(join(outDir, 'js', 'define', 'wec-button.js'))).toBe(true);
      expect(existsSync(join(outDir, 'js', 'components', 'atoms', 'chunk.js'))).toBe(true);
      expect(existsSync(join(outDir, 'js', 'index.d.ts'))).toBe(false);

      // CSS token.
      expect(existsSync(join(outDir, 'css', 'tokens.css'))).toBe(true);

      // libraries.yml: urut + type module + css + dependency.
      const yml = readFileSync(join(outDir, 'wec_ui.libraries.yml'), 'utf8');
      expect(yml).toContain('version: 1.2.3');
      expect(yml.indexOf('js/define/wec-button.js')).toBeLessThan(
        yml.indexOf('js/define/wec-input.js'),
      );
      expect(yml).toContain('type: module');
      expect(yml).toContain('css/tokens.css: {}');
      expect(yml).toContain('- core/drupal');

      // composer.json drupal-library.
      const composer = JSON.parse(readFileSync(join(outDir, 'composer.json'), 'utf8'));
      expect(composer.type).toBe('drupal-library');
      expect(composer.version).toBe('1.2.3');
    } finally {
      rmSync(base, { recursive: true, force: true });
    }
  });

  it('menolak versi kosong', () => {
    expect(() => assembleDrupalPackage({ version: '' })).toThrow(/version wajib/i);
  });
});
