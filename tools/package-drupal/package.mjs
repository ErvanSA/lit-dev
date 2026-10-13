/**
 * Assemble paket Drupal (`type: drupal-library`) dari hasil build:
 *
 *   packages/core/dist  +  tokens/build/tokens.css
 *     → packages/drupal/wec_ui/
 *          css/tokens.css          (muat sekali per halaman)
 *          js/...                  (dist ESM, struktur dipertahankan)
 *          wec_ui.libraries.yml    (definisi library, js type: module)
 *          composer.json           (type: drupal-library)
 *
 * Jalankan: pnpm package:drupal (setelah `pnpm build`).
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CORE_DIR = resolve(here, '../../packages/core/dist');
const DEFAULT_TOKENS_CSS = resolve(here, '../../tokens/build/tokens.css');
const DEFAULT_OUT = resolve(here, '../../packages/drupal/wec_ui');

/** Salin isi srcDir → destDir secara rekursif, tanpa file deklarasi TypeScript. */
function copyJsTree(srcDir, destDir) {
  for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
    const src = join(srcDir, entry.name);
    const dest = join(destDir, entry.name);
    if (entry.isDirectory()) {
      mkdirSync(dest, { recursive: true });
      copyJsTree(src, dest);
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.js.map')) {
      cpSync(src, dest);
    }
    // *.d.ts / *.d.ts.map dilewati — tidak dipakai PHP/Drupal.
  }
}

/**
 * Assemble paket Drupal.
 * @param {{ coreDir?: string, tokensCss?: string, outDir?: string, version: string }} options
 * @returns {string[]} daftar entrypoint `define/*.js` yang terdaftar di libraries.yml.
 */
export function assembleDrupalPackage({
  coreDir = DEFAULT_CORE_DIR,
  tokensCss = DEFAULT_TOKENS_CSS,
  outDir = DEFAULT_OUT,
  version,
}) {
  if (!version) {
    throw new Error('version wajib diisi (dibaca dari packages/core/package.json).');
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(join(outDir, 'css'), { recursive: true });
  mkdirSync(join(outDir, 'js'), { recursive: true });

  // 1. CSS token (muat sekali per halaman).
  cpSync(tokensCss, join(outDir, 'css', 'tokens.css'));

  // 2. JS dist (struktur dipertahankan agar import relatif tetap valid).
  copyJsTree(coreDir, join(outDir, 'js'));

  // 3. Entrypoints define/*.js → libraries.yml.
  const defines = readdirSync(join(coreDir, 'define'))
    .filter((f) => f.endsWith('.js'))
    .sort();

  const jsEntries = defines
    .map((f) => `    js/define/${f}:\n      attributes:\n        type: module`)
    .join('\n');

  const librariesYml = `# DIGENERATE oleh tools/package-drupal/package.mjs — jangan edit manual.
# Jalankan ulang: pnpm package:drupal
wec_ui:
  version: ${version}
  css:
    theme:
      css/tokens.css: {}
  js:
${jsEntries}
  dependencies:
    - core/drupal
`;

  writeFileSync(join(outDir, 'wec_ui.libraries.yml'), librariesYml);

  // 4. composer.json (dipakai bila dipublish sebagai paket composer).
  const composer = {
    name: 'wec/wec-ui',
    description: 'Design system wec-ui (Web Components/Lit) untuk Drupal 10/11.',
    type: 'drupal-library',
    license: 'UNLICENSED',
    version,
  };
  writeFileSync(join(outDir, 'composer.json'), `${JSON.stringify(composer, null, 2)}\n`);

  // 5. README singkat untuk pemakai Drupal.
  const readme = `# wec-ui untuk Drupal (${version})

Paket \`drupal-library\` — hasil build design system wec-ui.

## Pemasangan

1. Salin folder ini ke \`libraries/wec_ui\` (atau pasang via composer bila
   dipublish ke registry internal).
2. Lampirkan library di theme/modul:

   \`\`\`twig
   {{ attach_library('wec_ui/wec_ui') }}
   \`\`\`

3. Pakai komponen di Twig, contoh:

   \`\`\`twig
   <wec-button variant="primary">{{ 'Simpan'|t }}</wec-button>
   \`\`\`

File \`wec_ui.libraries.yml\` sudah mendaftarkan semua entrypoint komponen
(\`type: module\`) + token CSS. Detail tiap komponen: lihat Storybook.
`;
  writeFileSync(join(outDir, 'README.md'), readme);

  return defines;
}

const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const corePkg = JSON.parse(
    readFileSync(resolve(here, '../../packages/core/package.json'), 'utf8'),
  );
  const defines = assembleDrupalPackage({ version: corePkg.version });
  console.log(
    `✔ paket Drupal digenerate di packages/drupal/wec_ui (v${corePkg.version}, ${defines.length} entrypoint)`,
  );
}
