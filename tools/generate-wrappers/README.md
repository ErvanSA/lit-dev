# tools/generate-wrappers

Generator wrapper **React** (`@wec-ui/react`) dari Custom Elements Manifest.

## Alur kerja

1. Build core dulu (menghasilkan `packages/core/custom-elements.json`):
   ```bash
   pnpm --filter wec-ui build
   ```
2. Generate wrapper:
   ```bash
   pnpm gen:wrappers
   ```
3. Build wrapper:
   ```bash
   pnpm --filter @wec-ui/react build
   ```

`pnpm build` dari root menjalankan ketiganya berurutan.

## Detail

- Setiap custom element di manifest → satu file `packages/react/src/<Nama>.ts`
  berbasis `createComponent` dari `@lit/react`.
- Event di CEM (`wec-input`, `wec-change`, dst. dan `click`) dipetakan ke props
  `onWecInput`, `onWecChange`, `onClick`.
- Setiap file diawali banner `'use client'` — aman untuk Next.js App Router.
- File hasil generate **tidak diedit manual** — perubahan API komponen cukup
  dilakukan di core lalu regenerate.
- Generator `@wec-ui/angular` menyusul di Fase 2 dengan pola yang sama.

## Smoke test

Wrapper diuji di **browser asli** (Playwright), bukan happy-dom — @lit/react
mengandalkan layout effect yang tidak sepenuhnya didukung happy-dom. Alurnya:

1. `pnpm build:react-smoke` — bundle entry `tests/e2e/manual.tsx` (esbuild)
   menjadi `packages/core/tests/e2e/fixtures/react-bundle.js` (digenerate,
   gitignored).
2. `pnpm test:e2e` — spec `react-smoke.spec.ts` memuat
   `fixtures/react-smoke.html` di Chromium dan memverifikasi props/event.
