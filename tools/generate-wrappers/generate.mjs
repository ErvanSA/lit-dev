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
import {
  DEFAULT_MANIFEST,
  collectCustomElements,
  eventNameToHandler,
  modulePathToImport,
  tagNameToComponentName,
} from './cem.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_OUT = resolve(here, '../../packages/react/src');

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

  const entries = collectCustomElements(manifest).map((element) => {
    const { tagName, declarationName, modulePath, declaration } = element;
    const events = (declaration?.events ?? []).map((e) => e.name);
    const eventsLiteral =
      events.length > 0
        ? events.map((name) => `    ${eventNameToHandler(name)}: '${name}',`).join('\n')
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

    return { componentName, content };
  });

  if (entries.length === 0) {
    throw new Error('Tidak ada custom element ditemukan di manifest — jalankan build core dulu.');
  }

  for (const { componentName, content } of entries) {
    writeFileSync(join(outDir, `${componentName}.ts`), content);
  }

  const barrel = `'use client';

/**
 * Barrel wrapper React @wec-ui/react.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers
 */

${entries.map((e) => `export * from './${e.componentName}.js';`).join('\n')}
`;

  writeFileSync(join(outDir, 'index.ts'), barrel);
  return entries.map((e) => e.componentName);
}

const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const manifest = JSON.parse(readFileSync(DEFAULT_MANIFEST, 'utf8'));
  const names = generateWrappers({ manifest });
  console.log(`✔ ${names.length} wrapper React digenerate: ${names.join(', ')}`);
}
