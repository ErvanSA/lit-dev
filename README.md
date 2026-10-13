# wec-ui

Design system internal berbasis **Web Components (Lit 3)** dengan pola **Atomic Design**.
Dipakai lintas **Angular ≥ 18, React (latest & latest-1), Next.js ≥ 14 (App Router), dan
Drupal 10/11**. Rencana lengkap: lihat [`PLAN.md`](./PLAN.md).

## Status: Fase 0 — Fondasi ✅

Scaffold monorepo selesai: build core (ESM + CEM), token desain (light/dark), generator
ikon, Storybook, Vitest + Playwright, ESLint + Prettier + lint-staged, stub GitLab CI.
Komponen penuh menyusul di Fase 1 (`wec-input`, `wec-icon`, `wec-badge`, `wec-checkbox`,
`wec-form-field`, `wec-card`).

## Struktur

```
wec-ui/
├─ packages/core/        # "wec-ui" — komponen Lit murni (atoms/molecules/organisms)
├─ tokens/               # tokens.json → Style Dictionary → build/tokens.css (light+dark)
├─ tools/icons/          # SVG dari tim desain → generator registry TS
└─ PLAN.md               # rencana implementasi per fase
```

## Prasyarat

- Node.js ≥ 22 (lihat `.nvmrc`)
- pnpm ≥ 10 (aktif via `corepack enable`)

## Perintah utama (dari root repo)

| Perintah            | Fungsi                                                       |
| ------------------- | ------------------------------------------------------------ |
| `pnpm install`      | Pasang dependensi semua workspace                            |
| `pnpm dev`          | Jalankan Storybook (`localhost:6006`)                        |
| `pnpm build`        | Build tokens → ikon → core dist ESM + `custom-elements.json` |
| `pnpm test`         | Unit (Vitest) + e2e (Playwright)                             |
| `pnpm test:unit`    | Unit test saja                                               |
| `pnpm test:e2e`     | Browser test saja (auto-start vite dev server)               |
| `pnpm lint`         | ESLint                                                       |
| `pnpm format`       | Prettier (tulis)                                             |
| `pnpm typecheck`    | `tsc --noEmit` untuk packages/core                           |
| `pnpm build:tokens` | Regenerate `tokens/build/tokens.css` dari `tokens.json`      |
| `pnpm build:icons`  | Regenerate registry ikon dari `tools/icons/svg/*.svg`        |

> Pertama kali menjalankan `test:e2e`: `pnpm exec playwright install chromium`.

## Konsumsi cepat (preview — API final di Fase 1)

```js
// React / Next.js (client)
import 'wec-ui/define/wec-button.js';
```

```html
<wec-button variant="primary" size="md">Simpan</wec-button>
```

Theming hanya via CSS custom properties berprefix `--wec-` (muat `tokens/build/tokens.css`
sekali per aplikasi). Dark mode: set `data-theme="dark"` pada `<html>` atau pembungkus
aplikasi.

## Alur kerja komponen baru (ringkas)

1. Buat folder komponen di `packages/core/src/components/{atoms|molecules}/<nama>/`.
2. Styling 100% via `var(--wec-*)` — tanpa nilai hardcode.
3. Tambah `*.stories.ts` + entri JSDoc (`@slot`, `@cssprop`, `@fires`) — CEM otomatis
   memunculkannya ke `custom-elements.json` untuk docs & generator wrapper.
4. Tambah unit test (Vitest) + test browser (Playwright).
5. Jalankan `pnpm lint && pnpm typecheck && pnpm test`.
