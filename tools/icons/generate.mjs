/**
 * Generator registry ikon: tools/icons/svg/*.svg
 *   → packages/core/src/components/atoms/icon/registry.ts
 *
 * Jalankan: pnpm build:icons (dari root repo).
 * SVG desain dari tim desain cukup di-drop ke tools/icons/svg/ lalu jalankan ulang.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_SRC = join(here, 'svg');
const DEFAULT_OUT = resolve(here, '../../packages/core/src/components/atoms/icon/registry.ts');

/** Ubah nama file menjadi nama ikon kebab-case (mis. "Arrow Right.svg" → "arrow-right"). */
export function toIconName(fileName) {
  return fileName
    .replace(/\.svg$/i, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/** Bersihkan markup SVG: buang XML declaration, DOCTYPE, dan komentar; rapatkan whitespace. */
export function sanitizeSvg(svg) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

/**
 * Generate registry TS dari semua SVG di srcDir.
 * @param {{ srcDir?: string, outFile?: string }} options
 * @returns {string[]} daftar nama ikon yang dihasilkan (terurut abjad).
 */
export function generateIcons({ srcDir = DEFAULT_SRC, outFile = DEFAULT_OUT } = {}) {
  const files = readdirSync(srcDir)
    .filter((file) => file.toLowerCase().endsWith('.svg'))
    .sort();

  const entries = files.map((file) => [
    toIconName(file),
    sanitizeSvg(readFileSync(join(srcDir, file), 'utf8')),
  ]);

  const names = entries.map(([name]) => name);
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
  if (duplicates.length > 0) {
    throw new Error(`Nama ikon duplikat: ${[...new Set(duplicates)].join(', ')}`);
  }

  const typeUnion = names.length > 0 ? names.map((name) => `'${name}'`).join(' | ') : 'never';
  const body = entries
    .map(([name, svg]) => `  '${name}':\n    '${svg.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',`)
    .join('\n');

  const content = `/*
 * DIGENERATE oleh tools/icons/generate.mjs — jangan edit manual.
 * Sumber: tools/icons/svg/*.svg. Jalankan ulang: pnpm build:icons
 */

/** Nama ikon yang tersedia di registry. */
export type WecIconName = ${typeUnion};

/** Registry ikon: nama → markup SVG. */
export const icons: Record<WecIconName, string> = {
${body}
};
`;

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, content);
  return names;
}

const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const names = generateIcons();
  console.log(
    `✔ registry ikon digenerate (${names.length} ikon): ${names.join(', ') || '(kosong)'}`,
  );
}
