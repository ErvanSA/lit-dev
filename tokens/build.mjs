/**
 * Build token desain: tokens/tokens.json → tokens/build/tokens.css
 *
 * - Light theme di `:root, :host` (default).
 * - Dark theme di `[data-theme="dark"]` (override warna saja).
 * - Semua variabel berprefix `--wec-`.
 *
 * Jalankan: pnpm build:tokens (dari root repo).
 */
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';

const here = dirname(fileURLToPath(import.meta.url));
const buildDir = join(here, 'build');
const tokens = JSON.parse(readFileSync(join(here, 'tokens.json'), 'utf8'));

const HEADER = [
  '/*',
  ' * DIGENERATE dari tokens/tokens.json (Style Dictionary) — jangan edit manual.',
  ' * Jalankan ulang: pnpm build:tokens',
  ' *',
  ' * Light theme : :root, :host (default)',
  ' * Dark theme  : [data-theme="dark"]',
  ' */',
  '',
].join('\n');

StyleDictionary.registerFormat({
  name: 'css/wec-variables',
  format: ({ dictionary, options }) => {
    const lines = dictionary.allTokens.map((token) => `  --wec-${token.name}: ${token.value};`);
    return `${options.selector} {\n${lines.join('\n')}\n}\n`;
  },
});

/**
 * Build satu grup tema ke file CSS sementara di buildDir.
 * @param {object} group objek token (mis. tokens.light)
 * @param {string} selector CSS selector blok variabel
 * @param {string} tmpFile nama file sementara
 */
async function buildTheme(group, selector, tmpFile) {
  const sd = new StyleDictionary({
    tokens: group,
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: buildDir + '/',
        files: [{ destination: tmpFile, format: 'css/wec-variables', options: { selector } }],
      },
    },
  });
  await sd.buildAllPlatforms();
}

await buildTheme(tokens.light, ':root, :host', '.light.tmp.css');
await buildTheme(tokens.dark, '[data-theme="dark"]', '.dark.tmp.css');

const css = [
  HEADER,
  readFileSync(join(buildDir, '.light.tmp.css'), 'utf8'),
  '\n',
  readFileSync(join(buildDir, '.dark.tmp.css'), 'utf8'),
].join('');

writeFileSync(join(buildDir, 'tokens.css'), css);
rmSync(join(buildDir, '.light.tmp.css'));
rmSync(join(buildDir, '.dark.tmp.css'));

console.log('✔ tokens/build/tokens.css digenerate (light + dark)');
