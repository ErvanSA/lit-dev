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

Wrapper diuji dengan unit test render (Vitest + happy-dom,
`packages/react/tests/unit/wrapper.test.ts`) yang memverifikasi setiap wrapper
merender custom element beserta konten slotnya.

Penerapan **props & event** oleh `@lit/react` tidak dapat diverifikasi di
happy-dom (keterbatasan layout effect) — verifikasi event dilakukan lewat
panel **Actions** di Storybook (browser asli) dan dokumentasi penggunaan.
