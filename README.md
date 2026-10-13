# wec-ui

Design system internal berbasis **Web Components (Lit 3)** dengan pola **Atomic Design**.
Dipakai lintas **Angular ≥ 18, React (latest & latest-1), Next.js ≥ 14 (App Router), dan
Drupal 10/11**. Rencana lengkap: lihat [`PLAN.md`](./PLAN.md).

## Status: Pivot brand Telkomsel ✅

Komponen aktif saat ini **hanya `wec-button`** (varian `primary` | `outline`,
state `disabled`) sesuai desain terbaru — pill merah Telkomsel `#FF0025`, font
**Poppins**. Token warna & font sudah Telkomsel (`tokens/tokens.json` +
`tokens/fonts/`). Infrastruktur tetap: docs Storybook (MDX), test unit (Vitest),
wrapper **`@wec-ui/react`** + **`@wec-ui/angular`** (digenerate dari CEM),
paket **Drupal** (`type: drupal-library`), audit aksesibilitas
([`A11Y.md`](./A11Y.md)). Komponen lain menyusul sesuai desain.

## Struktur

```
wec-ui/
├─ packages/core/        # "wec-ui" — komponen Lit murni (atoms/molecules/organisms)
├─ packages/react/       # "@wec-ui/react" — wrapper React, digenerate dari CEM
├─ packages/angular/     # "@wec-ui/angular" — wrapper Angular, digenerate dari CEM
├─ packages/drupal/      # artifact paket drupal-library (digenerate, gitignored)
├─ tokens/               # tokens.json → Style Dictionary → build/tokens.css (light+dark)
├─ tools/icons/          # SVG dari tim desain → generator registry TS
├─ tools/generate-wrappers/  # generator wrapper React + Angular dari CEM
├─ tools/package-drupal/ # assembler paket Drupal
├─ A11Y.md               # audit aksesibilitas
└─ PLAN.md               # rencana implementasi per fase
```

## Prasyarat

- Node.js ≥ 22 (lihat `.nvmrc`)
- pnpm ≥ 10 (aktif via `corepack enable`)

## Perintah utama (dari root repo)

| Perintah                    | Fungsi                                                  |
| --------------------------- | ------------------------------------------------------- |
| `pnpm install`              | Pasang dependensi semua workspace                       |
| `pnpm dev`                  | Jalankan Storybook (`localhost:6006`)                   |
| `pnpm build`                | Build tokens → ikon → core (ESM + CEM) → wrapper React  |
| `pnpm test`                 | Unit test (Vitest: node + happy-dom)                    |
| `pnpm lint`                 | ESLint                                                  |
| `pnpm format`               | Prettier (tulis)                                        |
| `pnpm typecheck`            | `tsc --noEmit` semua package                            |
| `pnpm build:tokens`         | Regenerate `tokens/build/tokens.css` dari `tokens.json` |
| `pnpm build:icons`          | Regenerate registry ikon dari `tools/icons/svg/*.svg`   |
| `pnpm gen:wrappers`         | Regenerate `@wec-ui/react` dari `custom-elements.json`  |
| `pnpm gen:wrappers:angular` | Regenerate `@wec-ui/angular` dari CEM                   |
| `pnpm package:drupal`       | Assemble paket Drupal ke `packages/drupal/wec_ui/`      |
| `pnpm changeset`            | Catat perubahan (changelog internal, fixed version)     |

> Interaksi & event komponen diverifikasi lewat panel **Actions** di Storybook.

## Konsumsi cepat

**React / Next.js** (wrapper sudah `'use client'`):

```tsx
import { Button } from '@wec-ui/react';

<Button variant="primary" onClick={gantiNomor}>Ganti Nomor</Button>
<Button variant="outline" onClick={unduhKontrak}>Unduh Kontrak</Button>
<Button variant="primary" disabled>Cek</Button>
```

**Angular ≥ 18**:

```ts
import { WecUiModule } from '@wec-ui/angular';
```

```html
<wec-button variant="primary" (click)="gantiNomor()">Ganti Nomor</wec-button>
```

**Drupal 10/11 / tanpa wrapper** — muat definisi sekali:

```js
import 'wec-ui/define/wec-button.js';
```

Contoh lengkap (termasuk `libraries.yml` + Twig) ada di docs `wec-button`
di Storybook.

Theming hanya via CSS custom properties berprefix `--wec-` (muat
`tokens/build/tokens.css` + `tokens/build/fonts.css` sekali per aplikasi).
Dark mode: set `data-theme="dark"` pada `<html>` atau pembungkus aplikasi.

## Konsumsi via tarball lokal (repo lain)

Untuk testing package di repo React/Angular lain tanpa registry:

```powershell
# 1. Build + pack semua (hasil di releases/ + releases/INSTALL.md)
pnpm pack:all

# 2. Di repo konsumen — aktifkan override (sekali), pnpm 12 baca dari pnpm-workspace.yaml:
#    overrides:
#      wec-ui: file:C:/Users/Ervan/Documents/Job/lit/wec-ui/releases/wec-ui-0.3.0.tgz

# 3. Install kedua tarball dalam SATU perintah (core dulu + wrapper):
pnpm add C:\...\releases\wec-ui-0.3.0.tgz C:\...\releases\wec-ui-react-0.3.0.tgz

# 4. Muat di entry aplikasi:
import 'wec-ui/tokens.css';
import 'wec-ui/fonts.css';
import { Button } from '@wec-ui/react';

# 5. Saat ada perubahan: pnpm pack:all lagi → pnpm add <tgz> --force
```

Detail lengkap + gotcha (override wajib, urutan, direct dep) auto-generated di
`releases/INSTALL.md` setiap `pnpm pack:all`.

## Alur kerja komponen baru (ringkas)

1. Buat folder komponen di `packages/core/src/components/{atoms|molecules}/<nama>/`.
2. Styling 100% via `var(--wec-*)` — tanpa nilai hardcode.
3. Tambah SATU story `Playground` (konvensi) + entri JSDoc (`@slot`, `@cssprop`,
   `@fires`) — CEM otomatis memunculkannya ke `custom-elements.json`.
4. Tambah halaman MDX `docs.page` (contoh React/Angular/Next/Drupal).
5. Tambah unit test (Vitest) + test browser (Playwright).
6. `pnpm build && pnpm gen:wrappers` → wrapper React otomatis terbentuk.
7. Jalankan `pnpm lint && pnpm typecheck && pnpm test`.
