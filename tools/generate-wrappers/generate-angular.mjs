/**
 * Generator wrapper Angular dari Custom Elements Manifest.
 *
 *   packages/core/custom-elements.json → packages/angular/src/*
 *
 * Setiap custom element mendapat satu **directive standalone** typed
 * (`@Input` setter + `@Output` EventEmitter) yang dipasang pada elemen
 * custom-nya sendiri. Event native (`click`) tidak dibungkus — sudah
 * didukung template Angular secara native.
 *
 * Jalankan: pnpm gen:wrappers:angular (setelah `pnpm build` core).
 */
import { mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_MANIFEST,
  collectCustomElements,
  eventNameToOutput,
  modulePathToImport,
  tagNameToComponentName,
} from './cem.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_MANIFEST_PATH = DEFAULT_MANIFEST;
const DEFAULT_OUT = resolve(here, '../../packages/angular/src');

/** Tipe detail event per `tagName:event` — sisanya memakai fallback generik. */
const EVENT_DETAIL_TYPES = {
  'wec-input:wec-input': '{ value: string }',
  'wec-input:wec-change': '{ value: string }',
  'wec-textarea:wec-input': '{ value: string }',
  'wec-textarea:wec-change': '{ value: string }',
  'wec-select:wec-change': '{ value: string }',
  'wec-checkbox:wec-change': '{ checked: boolean; value: string }',
  'wec-switch:wec-change': '{ checked: boolean }',
  'wec-radio-group:wec-change': '{ value: string }',
};

const HEADER = (tagName) => `/**
 * Wrapper Angular untuk <${tagName}>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate-angular.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers:angular
 */
`;

/**
 * Generate directive Angular dari manifest.
 * @param {{ manifest: object, outDir?: string }} options
 * @returns {string[]} daftar nama directive yang dihasilkan.
 */
export function generateAngularWrappers({ manifest, outDir = DEFAULT_OUT }) {
  // Outdir khusus hasil generate — bersihkan file lama.
  let existing = [];
  try {
    existing = readdirSync(outDir).filter((f) => f.endsWith('.ts'));
  } catch {
    // folder belum ada — biarkan.
  }
  mkdirSync(outDir, { recursive: true });
  for (const file of existing) {
    unlinkSync(join(outDir, file));
  }

  const elements = collectCustomElements(manifest);
  if (elements.length === 0) {
    throw new Error('Tidak ada custom element ditemukan di manifest — jalankan build core dulu.');
  }

  const directives = [];

  for (const element of elements) {
    const { tagName, declarationName, modulePath, declaration } = element;
    const componentName = tagNameToComponentName(tagName);
    const directiveName = `${componentName}Directive`;
    const importPath = modulePathToImport(modulePath);

    // Input: semua field publik pada deklarasi (skip internal `_`).
    const fields = (declaration?.members ?? []).filter(
      (m) => m.kind === 'field' && !m.name.startsWith('_') && !m.static && !m.private,
    );
    const inputs = fields
      .map(
        (field) => `  @Input() set ${field.name}(value: ${declarationName}['${field.name}']) {
    this._element.${field.name} = value;
  }`,
      )
      .join('\n\n');

    // Output: event custom (event native seperti `click` didukung Angular langsung).
    const customEvents = (declaration?.events ?? [])
      .map((e) => e.name)
      .filter((name) => name !== 'click');
    const outputs = customEvents
      .map((name) => {
        const detail = EVENT_DETAIL_TYPES[`${tagName}:${name}`] ?? 'Record<string, unknown>';
        const outputName = eventNameToOutput(name);
        return `  /** Diteruskan dari event \`${name}\`. */\n  @Output() ${outputName} = new EventEmitter<CustomEvent<${detail}>>();`;
      })
      .join('\n\n');

    const wiring = customEvents
      .map((name) => {
        const detail = EVENT_DETAIL_TYPES[`${tagName}:${name}`] ?? 'Record<string, unknown>';
        const outputName = eventNameToOutput(name);
        return `    on('${name}', (event) => this.${outputName}.emit(event as CustomEvent<${detail}>));`;
      })
      .join('\n');

    const hasEvents = customEvents.length > 0;
    const implementsClause = hasEvents ? ' implements OnInit, OnDestroy' : '';
    const angularImports = ['Directive', 'ElementRef', 'Input', 'inject'];
    if (hasEvents) {
      angularImports.push('EventEmitter', 'OnDestroy', 'OnInit', 'Output');
    }
    const importsBlock = `import {
  ${angularImports.join(',\n  ')},
} from '@angular/core';`;
    const lifecycle = hasEvents
      ? `  ngOnInit(): void {
    const on = (type: string, handler: (event: Event) => void): void => {
      this._element.addEventListener(type, handler);
      this._teardowns.push(() => this._element.removeEventListener(type, handler));
    };
${wiring}
  }

  ngOnDestroy(): void {
    for (const teardown of this._teardowns) {
      teardown();
    }
  }
`
      : '';

    const content = `${HEADER(tagName)}${importsBlock}
import type { ${declarationName} } from '${importPath}';

@Directive({
  selector: '${tagName}',
  standalone: true,
})
export class ${directiveName}${implementsClause} {
  private readonly _element: ${declarationName} = inject<ElementRef<${declarationName}>>(
    ElementRef,
  ).nativeElement;${hasEvents ? '\n  private readonly _teardowns: Array<() => void> = [];' : ''}
${inputs ? `\n${inputs}\n` : ''}${outputs ? `\n${outputs}\n` : ''}${lifecycle}}
`;

    writeFileSync(join(outDir, `${directiveName}.ts`), content);
    directives.push({ directiveName, content });
  }

  const moduleImports = directives
    .map((d) => `import { ${d.directiveName} } from './${d.directiveName}.js';`)
    .join('\n');
  const names = directives.map((d) => d.directiveName);

  const moduleFile = `/**
 * NgModule untuk konsumen non-standalone.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate-angular.mjs — jangan edit manual.
 */
import { NgModule } from '@angular/core';
${moduleImports}

@NgModule({
  imports: [${names.join(', ')}],
  exports: [${names.join(', ')}],
})
export class WecUiModule {}
`;

  const barrel = `/**
 * Barrel wrapper Angular @wec-ui/angular.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate-angular.mjs — jangan edit manual.
 */

${directives.map((d) => `export * from './${d.directiveName}.js';`).join('\n')}
export * from './wec-ui.module.js';
`;

  writeFileSync(join(outDir, 'wec-ui.module.ts'), moduleFile);
  writeFileSync(join(outDir, 'index.ts'), barrel);
  return names;
}

const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const manifest = JSON.parse(readFileSync(DEFAULT_MANIFEST_PATH, 'utf8'));
  const names = generateAngularWrappers({ manifest });
  console.log(`✔ ${names.length} directive Angular digenerate: ${names.join(', ')}`);
}
