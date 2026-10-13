/**
 * Generator wrapper React dari Custom Elements Manifest.
 *
 *   packages/core/custom-elements.json → packages/react/src/*.ts
 *
 * Setiap custom element mendapat satu komponen React (@lit/react) yang
 * diawali banner 'use client' (aman untuk Next.js App Router).
 *
 * Jalankan: pnpm gen:wrappers (dari root repo, setelah `pnpm build` core).
 */
import { mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_MANIFEST = resolve(here, '../../packages/core/custom-elements.json');
const DEFAULT_OUT = resolve(here, '../../packages/react/src');

/** 'wec-form-field' → 'FormField' (prefix `wec-` dibuang). */
export function tagNameToComponentName(tagName) {
  const parts = tagName.split('-').filter(Boolean);
  if (parts[0]?.toLowerCase() === 'wec') {
    parts.shift();
  }
  if (parts.length === 0) {
    throw new Error(`Nama tag tidak valid: ${tagName}`);
  }
  return parts.map((part) => part[0].toUpperCase() + part.slice(1)).join('');
}

/** 'wec-input' → 'onWecInput'; 'click' → 'onClick'. */
export function eventNameToHandler(event) {
  return (
    'on' +
    event
      .split('-')
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join('')
  );
}

/** 'src/components/atoms/wec-button/wec-button.ts' → 'wec-ui/dist/.../wec-button.js'. */
export function modulePathToImport(modulePath) {
  const jsPath = modulePath.replace(/^src\//, '').replace(/\.ts$/, '.js');
  return `wec-ui/dist/${jsPath}`;
}

const HEADER = (tagName) => `'use client';

/**
 * Wrapper React untuk <${tagName}>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers
 */
`;

/**
 * Generate komponen React dari manifest.
 * @param {{ manifest: object, outDir: string }} options
 * @returns {string[]} daftar nama komponen yang dihasilkan.
 */
export function generateWrappers({ manifest, outDir = DEFAULT_OUT }) {
  // Outdir dikhususkan untuk hasil generate — bersihkan file lama agar
  // komponen yang sudah tidak ada tidak tertinggal.
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

  const entries = [];

  for (const module of manifest.modules ?? []) {
    for (const exportEntry of module.exports ?? []) {
      if (exportEntry.kind !== 'custom-element-definition') continue;
      const tagName = exportEntry.name;
      const declarationName = exportEntry.declaration?.name;
      const modulePath = module.path;
      if (!tagName || !declarationName || !modulePath) continue;

      const declaration = (module.declarations ?? []).find((d) => d.name === declarationName);
      const events = declaration?.events ?? [];
      const eventsLiteral =
        events.length > 0
          ? events.map((e) => `    ${eventNameToHandler(e.name)}: '${e.name}',`).join('\n')
          : null;

      const componentName = tagNameToComponentName(tagName);
      const importPath = modulePathToImport(modulePath);
      const eventsBlock = eventsLiteral ? `,\n  events: {\n${eventsLiteral}\n  }` : '';

      const content = `${HEADER(tagName)}import * as React from 'react';
import { createComponent } from '@lit/react';
import { ${declarationName} } from '${importPath}';

export const ${componentName} = createComponent({
  react: React,
  tagName: '${tagName}',
  elementClass: ${declarationName}${eventsBlock},
  displayName: '${componentName}',
});

export type ${componentName}Props = React.ComponentProps<typeof ${componentName}>;
`;

      const file = join(outDir, `${componentName}.ts`);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, content);
      entries.push({ componentName, tagName });
    }
  }

  if (entries.length === 0) {
    throw new Error('Tidak ada custom element ditemukan di manifest — jalankan build core dulu.');
  }

  const sorted = [...entries].sort((a, b) => a.componentName.localeCompare(b.componentName));
  const barrel = `'use client';

/**
 * Barrel wrapper React @wec-ui/react.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers
 */

${sorted.map((e) => `export * from './${e.componentName}.js';`).join('\n')}
`;

  writeFileSync(join(outDir, 'index.ts'), barrel);
  return sorted.map((e) => e.componentName);
}

const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const manifest = JSON.parse(readFileSync(DEFAULT_MANIFEST, 'utf8'));
  const names = generateWrappers({ manifest });
  console.log(`✔ ${names.length} wrapper React digenerate: ${names.join(', ')}`);
}
