import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateAngularWrappers } from '../generate-angular.mjs';
import { eventNameToOutput } from '../cem.mjs';

const miniManifest = {
  modules: [
    {
      path: 'src/components/atoms/wec-button/wec-button.ts',
      declarations: [
        {
          kind: 'class',
          name: 'WecButton',
          tagName: 'wec-button',
          members: [
            { kind: 'field', name: 'variant' },
            { kind: 'field', name: 'size' },
            { kind: 'field', name: 'disabled' },
            { kind: 'field', name: 'loading' },
            { kind: 'field', name: '_button' },
          ],
          events: [{ name: 'click' }],
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
      path: 'src/components/atoms/wec-radio-group/wec-radio-group.ts',
      declarations: [
        {
          kind: 'class',
          name: 'WecRadioGroup',
          tagName: 'wec-radio-group',
          members: [
            { kind: 'field', name: 'value' },
            { kind: 'field', name: 'disabled' },
            { kind: 'field', name: 'labelledBy' },
          ],
          events: [{ name: 'wec-change' }],
        },
      ],
      exports: [
        {
          kind: 'custom-element-definition',
          name: 'wec-radio-group',
          declaration: { name: 'WecRadioGroup' },
        },
      ],
    },
  ],
};

describe('generator wrapper Angular', () => {
  it('eventNameToOutput', () => {
    expect(eventNameToOutput('wec-change')).toBe('wecChange');
    expect(eventNameToOutput('click')).toBe('click');
  });

  it('generate directive typed + module + barrel', () => {
    const outDir = mkdtempSync(join(tmpdir(), 'wec-angular-'));
    try {
      const names = generateAngularWrappers({ manifest: miniManifest, outDir });
      expect(names.sort()).toEqual(['ButtonDirective', 'RadioGroupDirective']);

      const button = readFileSync(join(outDir, 'ButtonDirective.ts'), 'utf8');
      expect(button).toContain("selector: 'wec-button'");
      expect(button).toContain("@Input() set variant(value: WecButton['variant'])");
      expect(button).toContain('this._element.variant = value;');
      // event native `click` tidak dibungkus:
      expect(button).not.toContain('wecClick');
      expect(button).not.toContain('EventEmitter');

      const radio = readFileSync(join(outDir, 'RadioGroupDirective.ts'), 'utf8');
      expect(radio).toContain(
        '@Output() wecChange = new EventEmitter<CustomEvent<{ value: string }>>();',
      );
      expect(radio).toContain("on('wec-change',");
      expect(radio).toContain('implements OnInit, OnDestroy');

      const module = readFileSync(join(outDir, 'wec-ui.module.ts'), 'utf8');
      expect(module).toContain('export class WecUiModule');
      expect(module).toContain('ButtonDirective');
      expect(module).toContain('RadioGroupDirective');

      const index = readFileSync(join(outDir, 'index.ts'), 'utf8');
      expect(index).toContain("export * from './ButtonDirective.js';");
      expect(index).toContain("export * from './wec-ui.module.js';");
    } finally {
      rmSync(outDir, { recursive: true, force: true });
    }
  });

  it('gagal bila manifest kosong', () => {
    expect(() => generateAngularWrappers({ manifest: { modules: [] }, outDir: '.' })).toThrow(
      /tidak ada custom element/i,
    );
  });
});
