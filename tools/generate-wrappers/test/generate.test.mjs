import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateWrappers } from '../generate.mjs';
import { eventNameToHandler, modulePathToImport, tagNameToComponentName } from '../cem.mjs';

const miniManifest = {
  modules: [
    {
      path: 'src/components/atoms/wec-button/wec-button.ts',
      declarations: [
        {
          kind: 'class',
          name: 'WecButton',
          tagName: 'wec-button',
          events: [{ name: 'click' }, { name: 'wec-change' }],
        },
      ],
      exports: [
        {
          kind: 'custom-element-definition',
          name: 'wec-button',
          declaration: { name: 'WecButton' },
        },
      ],
    },
    {
      path: 'src/components/molecules/wec-form-field/wec-form-field.ts',
      declarations: [
        { kind: 'class', name: 'WecFormField', tagName: 'wec-form-field', events: [] },
      ],
      exports: [
        {
          kind: 'custom-element-definition',
          name: 'wec-form-field',
          declaration: { name: 'WecFormField' },
        },
      ],
    },
  ],
};

describe('generator wrapper React', () => {
  it('konversi nama', () => {
    expect(tagNameToComponentName('wec-form-field')).toBe('FormField');
    expect(tagNameToComponentName('wec-button')).toBe('Button');
    expect(() => tagNameToComponentName('tanpa-prefix')).not.toThrow();
    expect(eventNameToHandler('wec-change')).toBe('onWecChange');
    expect(eventNameToHandler('click')).toBe('onClick');
    expect(modulePathToImport('src/define/wec-button.ts')).toBe('wec-ui/dist/define/wec-button.js');
  });

  it('generate file wrapper + barrel dengan banner use client', () => {
    const outDir = mkdtempSync(join(tmpdir(), 'wec-wrappers-'));
    try {
      const names = generateWrappers({ manifest: miniManifest, outDir });
      expect(names.sort()).toEqual(['Button', 'FormField']);

      const button = readFileSync(join(outDir, 'Button.ts'), 'utf8');
      expect(button).toContain("'use client';");
      expect(button).toContain(
        "import { WecButton } from 'wec-ui/dist/components/atoms/wec-button/wec-button.js'",
      );
      expect(button).toContain("tagName: 'wec-button'");
      expect(button).toContain("onClick: 'click',");
      expect(button).toContain("onWecChange: 'wec-change',");

      const index = readFileSync(join(outDir, 'index.ts'), 'utf8');
      expect(index).toContain("export * from './Button.js';");
      expect(index).toContain("export * from './FormField.js';");
    } finally {
      rmSync(outDir, { recursive: true, force: true });
    }
  });

  it('gagal bila manifest kosong', () => {
    expect(() => generateWrappers({ manifest: { modules: [] }, outDir: '.' })).toThrow(
      /tidak ada custom element/i,
    );
  });
});
