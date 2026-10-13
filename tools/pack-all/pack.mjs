/**
 * Build semua package lalu pack jadi tarball lokal (untuk konsumsi lintas repo).
 *
 *   pnpm pack:all
 *
 * Hasil: folder `releases/` berisi
 *   - wec-ui-<v>.tgz
 *   - wec-ui-react-<v>.tgz
 *   - wec-ui-angular-<v>.tgz
 *   - INSTALL.md  (perintah install siap tempel, urutan penting: core dulu)
 */
import { execSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const releasesDir = join(root, 'releases');

const PACKAGES = [
  { name: 'wec-ui', dir: 'packages/core' },
  { name: '@wec-ui/react', dir: 'packages/react' },
  { name: '@wec-ui/angular', dir: 'packages/angular' },
];

const run = (cmd, cwd = root) => {
  console.log(`> ${cmd}  (cwd: ${cwd})`);
  execSync(cmd, { cwd, stdio: 'inherit' });
};

// 1. Build semua (tokens → core → wrapper react/angular).
run('pnpm build');

// 2. Siapkan folder releases.
rmSync(releasesDir, { recursive: true, force: true });
mkdirSync(releasesDir, { recursive: true });

// 3. Pack tiap package ke releases/.
const tarballs = [];
for (const pkg of PACKAGES) {
  const pkgDir = join(root, pkg.dir);
  const version = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8')).version;

  run(`pnpm pack --pack-destination "${releasesDir}"`, pkgDir);

  // Deteksi nama file tarball yang baru dibuat (slug scope: @wec-ui/react → wec-ui-react).
  const slug = pkg.name.replace(/^@/, '').replace('/', '-');
  const file = readdirSync(releasesDir).find(
    (f) => f.startsWith(slug) && f.endsWith(`-${version}.tgz`),
  );
  if (!file) {
    throw new Error(`Tarball untuk ${pkg.name}@${version} tidak ditemukan di releases/`);
  }
  tarballs.push({ name: pkg.name, version, file });
}

// 4. INSTALL.md — perintah siap tempel (urutan: core dulu, baru wrapper).
const core = tarballs[0];
const react = tarballs.find((t) => t.name === '@wec-ui/react');
const angular = tarballs.find((t) => t.name === '@wec-ui/angular');

const installMd = `# wec-ui ${core.version} — paket lokal (tarball)

Generated oleh \`pnpm pack:all\`. Tarball: core + react + angular (versi sama).

## 1. Aktifkan override (sekali per repo konsumen)

pnpm 12 membaca settings dari **pnpm-workspace.yaml** (field \`pnpm\` di
package.json SUDAH TIDAK dibaca pnpm ≥12). Di root repo konsumen, buat/isi:

\`\`\`yaml
overrides:
  wec-ui: file:${releasesDir}/${core.file}
\`\`\`

Tujuan: dependency \`wec-ui\` milik wrapper diarahkan ke tarball core,
bukan dicari ke registry internet (404).

## 2. Install tarball (core + wrapper) — satu perintah

\`\`\`powershell
# React / Next.js:
pnpm add ${join(releasesDir, core.file)} ${join(releasesDir, react.file)}

# Angular:
pnpm add ${join(releasesDir, core.file)} ${join(releasesDir, angular.file)}
\`\`\`

Core di-install sebagai direct dependency agar \`tokens.css\`/\`fonts.css\`
bisa diimpor dari kode konsumen (transitive dep tidak di-hoist pnpm).

## 3. Pakai

\`\`\`js
// entry aplikasi
import 'wec-ui/tokens.css';
import 'wec-ui/fonts.css';
import 'wec-ui/define/wec-button.js';
// atau via wrapper:
import { Button } from '@wec-ui/react';
\`\`\`

Angular: import { WecUiModule } from '@wec-ui/angular' +
\`schemas: [CUSTOM_ELEMENTS_SCHEMA]\` pada component yang memakai tag wec-*.

> Konsumen Vite: bila HMR/optimize bermasalah dengan local package,
> tambahkan \`optimizeDeps: { exclude: ['wec-ui'] }\` di vite.config.

## Update ke build terbaru

\`\`\`powershell
# di repo wec-ui:
pnpm pack:all
# di repo konsumen (ulangi per tarball yang berubah):
pnpm add <path-tgz> --force
\`\`\`
`;

writeFileSync(join(releasesDir, 'INSTALL.md'), installMd);

console.log(`✔ ${tarballs.length} tarball + INSTALL.md digenerate di releases/`);
console.log(tarballs.map((t) => `  - ${t.file}`).join('\n'));
