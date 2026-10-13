# PLAN — `wec-ui`

Design system internal berbasis **Web Components (Lit)** dengan **Atomic Design**, dapat dipakai di **Angular ≥18, React (latest & latest-1), Next.js ≥14 (App Router), dan Drupal 10/11**.

---

## 1. Keputusan Arsitektur (final — hasil grilling)

| Area       | Keputusan                                                                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Paket      | Core unscoped `wec-ui` + wrapper `@wec-ui/react` (+ `@wec-ui/angular` fase 2)                                                                  |
| Repo       | Monorepo **pnpm workspace** di `Documents/Job/lit/wec-ui`                                                                                      |
| Styling    | **Shadow DOM**; theming hanya via CSS custom properties                                                                                        |
| Tokens     | `tokens.json` → **Style Dictionary** → `tokens.css`; dark mode via `[data-theme="dark"]`; CSS logical properties (siap RTL)                    |
| Icon       | SVG custom dari tim desain → script generator → registry TS                                                                                    |
| Drupal     | Fase 1: asset build via `*.libraries.yml` (opsi a); opsi composer package di fase lanjut                                                       |
| SSR Next   | Fase 1 client-only (`'use client'` sudah terkanan di build `@wec-ui/react`); eksperimen `@lit-labs/ssr` di fase 3                              |
| Versioning | Changesets _fixed mode_ (semua package versi sama)                                                                                             |
| Hosting    | Lokal dulu; GitLab self-hosted + publishing nanti; `.gitlab-ci.yml` stub sejak fase 0                                                          |
| Browser    | Modern evergreen (2 major terakhir Chrome/Edge/Firefox/Safari)                                                                                 |
| Bahasa     | LTR + Bahasa Indonesia dulu                                                                                                                    |
| Docs       | **Wajib per komponen**: Storybook (MDX + playground) + API otomatis dari Custom Elements Manifest + contoh pemakaian React/Angular/Next/Drupal |

---

## 2. Struktur Repo Target

```
wec-ui/
├─ packages/
│  ├─ core/                  # "wec-ui" — komponen Lit murni
│  │  ├─ src/
│  │  │  ├─ components/
│  │  │  │  ├─ atoms/        # button, input, icon, badge, checkbox
│  │  │  │  ├─ molecules/    # form-field, card
│  │  │  │  └─ organisms/    # (fase lanjut)
│  │  │  └─ index.ts
│  │  ├─ custom-elements.json        # CEM (sumber docs + generator wrapper)
│  │  └─ dist/                       # build ESM
│  ├─ react/                 # "@wec-ui/react" — digenerate dari CEM
│  └─ angular/               # "@wec-ui/angular" — fase 2, digenerate
├─ tokens/
│  ├─ tokens.json            # single source of truth desain
│  └─ build/                 # output Style Dictionary → tokens.css
├─ tools/
│  ├─ icons/                 # svg sumber + generator registry
│  └─ generate-wrappers/     # generator wrapper react/angular dari CEM
├─ .changeset/
├─ .gitlab-ci.yml            # stub
├─ pnpm-workspace.yaml
└─ PLAN.md
```

Prinsip kunci: **core = mesin, wrapper = setir nyaman**. Wrapper tipis (~6 baris/komponen) dan **digenerate otomatis** dari `custom-elements.json` — komponen baru di core otomatis mendapat wrapper + API docs.

---

## 3. Fase Implementasi

### Fase 0 — Fondasi (scaffold)

Tujuan: repo siap menerima komponen pertama.

- [ ] Inisialisasi `pnpm-workspace.yaml`, root `package.json`, Node LTS + `.nvmrc`
- [ ] `packages/core`: TypeScript strict, Vite library mode, target ES2022, output ESM
- [ ] `tokens/`: setup Style Dictionary (`tokens.json` → `tokens.css`, dua tema light/dark)
- [ ] `tools/icons/`: generator SVG → registry TS (struktur folder siap menampung SVG desain)
- [ ] Storybook 8 untuk `packages/core` (playground + slot MDX)
- [ ] Custom Elements Manifest (cem) plugin di build → `custom-elements.json`
- [ ] Test: Vitest (unit) + Playwright (browser/e2e) — setup + 1 smoke test
- [ ] ESLint + Prettier + lint-staged; `.gitlab-ci.yml` stub; `.gitignore`; README singkat
- [ ] `git init` + commit pertama

**Exit criteria**: `pnpm dev` menjalankan Storybook kosong; `pnpm build` menghasilkan core dist + `tokens.css` + CEM valid.

### Fase 1 — MVP design system

Tujuan: rilis pertama yang benar-benar bisa dipakai lintas framework.

- [ ] **Tokens**: palet warna, spacing, radius, font, shadow, z-index + set `[data-theme="dark"]`
- [ ] **Atoms**: `wec-button`, `wec-input`, `wec-icon`, `wec-badge`, `wec-checkbox`
- [ ] **Molecules**: `wec-form-field` (label + hint + error + slot control), `wec-card`
- [ ] Semua komponen lolos **DoD** (lihat §4)
- [ ] `tools/generate-wrappers/`: generator `@wec-ui/react` dari CEM (props typed, event wired, `'use client'` banner)
- [ ] Docs per komponen: MDX (contoh **React** dan **Angular**, catatan Next + Drupal `libraries.yml`)
- [ ] **Contoh integrasi Drupal**: snippet `*.libraries.yml` + Twig di docs
- [ ] Changesets fixed mode dikonfigurasi (belumdipublish — hanya changelog internal)

**Exit criteria**: `wec-ui@0.1.0` + `@wec-ui/react@0.1.0` terbentuk; semua komponen tampil di Storybook dengan docs lengkap; test hijau.

### Fase 2 — Perluasan

- [ ] Generator `@wec-ui/angular` (komponen Angular typed: `@Input/@Output`)
- [ ] Komponen berikutnya sesuai kebutuhan: `select`, `textarea`, `radio-group`, `switch`, `tabs`, `modal`, `tooltip`, dst. (prioritas dari konsumen pertama)
- [ ] Opsi **composer package** (`type: drupal-library`) dirilis dari pipeline yang sama
- [ ] Audit aksesibilitas menyeluruh (keyboard, focus ring, ARIA) + visual regression Playwright

### Fase 3 — Infra & eksperimen (opsional)

- [ ] Push ke GitLab self-hosted + CI penuh (build, test, Storybook artifact)
- [ ] Publishing ke registry internal (Nexus/Artifactory/GitLab Packages)
- [ ] Eksperimen SSR Next via `@lit-labs/ssr` + Declarative Shadow DOM
- [ ] Pertimbangkan website docs terpisah (Docusaurus) jika Storybook tidak cukup

---

## 4. Definition of Done — per komponen

Sebuah komponen dinyatakan "selesai" hanya jika:

1. Implementasi Lit + props/events typed + `reflect` untuk styling state
2. Styling 100% via CSS custom properties (tidak ada warna/spacing hardcode)
3. Test unit (Vitest) + test browser interaksi (Playwright)
4. Aksesibilitas dasar: keyboard, focus-visible, ARIA yang benar, kontras token lolos
5. Story `*.stories.ts` + halaman MDX: deskripsi, contoh React, contoh Angular, catatan Next/Drupal
6. Entri API otomatis muncul dari CEM (props, events, slots, CSS custom properties)
7. Wrapper React ter-generate dan teruji smoke

---

## 5. Cara Konsumsi (ringkasan, untuk docs)

| Framework    | Muat sekali                                                                          | Pakai                                        |
| ------------ | ------------------------------------------------------------------------------------ | -------------------------------------------- |
| React/Next   | `import 'wec-ui/define/wec-button.js'` atau `import { Button } from '@wec-ui/react'` | `<Button variant="primary" onWecClick={fn}>` |
| Angular ≥18  | `import 'wec-ui'` + `CUSTOM_ELEMENTS_SCHEMA`                                         | `<wec-button variant="primary">`             |
| Next.js      | sama dengan React; `'use client'` sudah otomatis via wrapper                         | —                                            |
| Drupal 10/11 | `*.libraries.yml` → `wec-ui.js` (module) + `tokens.css`                              | `<wec-button>` di Twig                       |

---

## 6. Tooling Stack

`pnpm` · TypeScript strict · Vite (library mode) · Lit 3 · Style Dictionary · `@lit/react` · Vitest · Playwright · Storybook 8 · Custom Elements Manifest · Changesets (fixed) · ESLint + Prettier · GitLab CI (stub)
