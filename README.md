# wec-ui

Design system internal berbasis **Web Components (Lit 3)** dengan pola **Atomic Design**.
Dipakai lintas **Angular ≥ 18, React (latest & latest-1), Next.js ≥ 14 (App Router), dan
Drupal 10/11**. Rencana lengkap: lihat [`PLAN.md`](./PLAN.md).

## Status: Fase 1 — MVP design system ✅

**Atoms**: `wec-button`, `wec-input`, `wec-icon`, `wec-badge`, `wec-checkbox` ·
**Molecules**: `wec-form-field`, `wec-card` — lengkap dengan docs (Storybook MDX),
test unit (Vitest) + browser (Playwright), dan wrapper `@wec-ui/react` yang
digenerate otomatis dari Custom Elements Manifest. Fase 0 (fondasi monorepo,
token, tooling) selesai sebelumnya.

## Struktur

```
wec-ui/
├─ packages/core/        # "wec-ui" — komponen Lit murni (atoms/molecules/organisms)
├─ packages/react/       # "@wec-ui/react" — wrapper React, digenerate dari CEM
├─ tokens/               # tokens.json → Style Dictionary → build/tokens.css (light+dark)
├─ tools/icons/          # SVG dari tim desain → generator registry TS
├─ tools/generate-wrappers/  # generator wrapper React dari custom-elements.json
└─ PLAN.md               # rencana implementasi per fase
```

## Prasyarat

- Node.js ≥ 22 (lihat `.nvmrc`)
- pnpm ≥ 10 (aktif via `corepack enable`)

## Perintah utama (dari root repo)

| Perintah            | Fungsi                                                  |
| ------------------- | ------------------------------------------------------- |
| `pnpm install`      | Pasang dependensi semua workspace                       |
| `pnpm dev`          | Jalankan Storybook (`localhost:6006`)                   |
| `pnpm build`        | Build tokens → ikon → core (ESM + CEM) → wrapper React  |
| `pnpm test`         | Unit (Vitest) + e2e (Playwright)                        |
| `pnpm test:unit`    | Unit test saja                                          |
| `pnpm test:e2e`     | Browser test saja (auto-start vite dev server)          |
| `pnpm lint`         | ESLint                                                  |
| `pnpm format`       | Prettier (tulis)                                        |
| `pnpm typecheck`    | `tsc --noEmit` semua package                            |
| `pnpm build:tokens` | Regenerate `tokens/build/tokens.css` dari `tokens.json` |
| `pnpm build:icons`  | Regenerate registry ikon dari `tools/icons/svg/*.svg`   |
| `pnpm gen:wrappers` | Regenerate `@wec-ui/react` dari `custom-elements.json`  |
| `pnpm changeset`    | Catat perubahan (changelog internal, fixed version)     |

> Pertama kali menjalankan `test:e2e`: `pnpm exec playwright install chromium`.

## Konsumsi cepat

**React / Next.js** (wrapper sudah `'use client'`):

```tsx
import { Button, Input, FormField } from '@wec-ui/react';

export function Formulir() {
  return (
    <FormField label="Email" required>
      <Input type="email" placeholder="nama@perusahaan.co.id" />
    </FormField>
  );
}
```

**Angular ≥ 18 / Drupal / tanpa wrapper** — muat definisi sekali:

```js
import 'wec-ui/define/wec-form-field.js';
import 'wec-ui/define/wec-input.js';
```

```html
<wec-form-field label="Email" required>
  <wec-input type="email"></wec-input>
</wec-form-field>
```

Contoh lengkap per framework (termasuk Drupal `libraries.yml` + Twig) ada di
halaman docs tiap komponen di Storybook.

Theming hanya via CSS custom properties berprefix `--wec-` (muat `tokens/build/tokens.css`
sekali per aplikasi). Dark mode: set `data-theme="dark"` pada `<html>` atau pembungkus
aplikasi.

## Alur kerja komponen baru (ringkas)

1. Buat folder komponen di `packages/core/src/components/{atoms|molecules}/<nama>/`.
2. Styling 100% via `var(--wec-*)` — tanpa nilai hardcode.
3. Tambah SATU story `Playground` (konvensi) + entri JSDoc (`@slot`, `@cssprop`,
   `@fires`) — CEM otomatis memunculkannya ke `custom-elements.json`.
4. Tambah halaman MDX `docs.page` (contoh React/Angular/Next/Drupal).
5. Tambah unit test (Vitest) + test browser (Playwright).
6. `pnpm build && pnpm gen:wrappers` → wrapper React otomatis terbentuk.
7. Jalankan `pnpm lint && pnpm typecheck && pnpm test`.
