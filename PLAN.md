# PLAN — `wec-ui`

Design system internal berbasis **Web Components (Lit)** dengan **Atomic Design**, dapat dipakai di **Angular ≥18, React (latest & latest-1), Next.js ≥14 (App Router), dan Drupal 10/11**.

> **STATUS (2026-10-13)** — Fase 0 ✅ · Fase 1 ✅ · Fase 2 ✅* · Fase 3 ❌ belum.
> **Rebrand Telkomsel (v0.3.0)** mengubah arah desain: komponen aktif saat ini
> **hanya `wec-button`** (varian `primary` | `outline`, state `disabled`) —
> 10 komponen Fase 1–2 dihapus; token warna & font kini brand Telkomsel
> (Poppins + Telkomsel Batik). Detail: bagian **7. Rebrand Telkomsel** + catatan
> deviasi per fase.

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

- [x] Inisialisasi `pnpm-workspace.yaml`, root `package.json`, Node LTS + `.nvmrc`
- [x] `packages/core`: TypeScript strict, Vite library mode, target ES2022, output ESM
- [x] `tokens/`: setup Style Dictionary (`tokens.json` → `tokens.css`, dua tema light/dark)
- [x] `tools/icons/`: generator SVG → registry TS (struktur folder siap menampung SVG desain)
- [x] Storybook 8 untuk `packages/core` (playground + slot MDX)
- [x] Custom Elements Manifest (cem) plugin di build → `custom-elements.json`
- [x] Test: Vitest (unit) + Playwright (browser/e2e) — setup + 1 smoke test
      _(catatan: e2e Playwright dihapus pada revisi unit-only — lihat §7)_
- [x] ESLint + Prettier + lint-staged; `.gitlab-ci.yml` stub; `.gitignore`; README singkat
- [x] `git init` + commit pertama

**Exit criteria**: `pnpm dev` menjalankan Storybook kosong; `pnpm build` menghasilkan core dist + `tokens.css` + CEM valid. — ✅ **TERPENUHI**

> Deviasi: "CSS logical properties (siap RTL)" dari §1 **belum** diterapkan —
> ditunda sampai ada kebutuhan RTL nyata.

### Fase 1 — MVP design system

Tujuan: rilis pertama yang benar-benar bisa dipakai lintas framework.

- [x] **Tokens**: palet warna, spacing, radius, font, shadow, z-index + set `[data-theme="dark"]`
- [x] **Atoms**: `wec-button`, `wec-input`, `wec-icon`, `wec-badge`, `wec-checkbox`
- [x] **Molecules**: `wec-form-field` (label + hint + error + slot control), `wec-card`
- [x] Semua komponen lolos **DoD** (lihat §4)
- [x] `tools/generate-wrappers/`: generator `@wec-ui/react` dari CEM (props typed, event wired, `'use client'` banner)
- [x] Docs per komponen: MDX (contoh **React** dan **Angular**, catatan Next + Drupal `libraries.yml`)
- [x] **Contoh integrasi Drupal**: snippet `*.libraries.yml` + Twig di docs
- [x] Changesets fixed mode dikonfigurasi (belum dipublish — hanya changelog internal)

**Exit criteria**: `wec-ui@0.1.0` + `@wec-ui/react@0.1.0` terbentuk; semua komponen tampil di Storybook dengan docs lengkap; test hijau. — ✅ **TERPENUHI** (saat itu v0.1.0)

> ⚠️ **Catatan**: seluruh komponen Fase 1 (kecuali `wec-button`) **dihapus
> pada rebrand Telkomsel v0.3.0** (lihat §7). Riwayat implementasinya tetap
> ada di git history — pola & infrastrukturnya (CEM, generator, docs, test)
> dipakai ulang untuk komponen berikutnya.

### Fase 2 — Perluasan

- [x] Generator `@wec-ui/angular` (komponen Angular typed: `@Input/@Output`)
- [x] Komponen berikutnya sesuai kebutuhan: `select`, `textarea`, `radio-group`, `switch` dibuat & lolos DoD — **lalu dihapus saat rebrand v0.3.0**; `tabs`, `modal`, `tooltip` **belum** (menunggu kebutuhan konsumen)
- [x] Opsi **composer package** (`type: drupal-library`) dirilis dari pipeline yang sama (`pnpm package:drupal`)
- [x] Audit aksesibilitas menyeluruh (keyboard, focus ring, ARIA) — lihat `A11Y.md`
      _(visual regression Playwright ❌ tidak dikerjakan — diganti keputusan test unit-only, lihat §7)_

### Fase 3 — Infra & eksperimen (opsional)

**Status: ❌ belum dimulai.**

- [ ] Push ke GitLab self-hosted + CI penuh (build, test, Storybook artifact)
- [ ] Publishing ke registry internal (Nexus/Artifactory/GitLab Packages)
- [ ] Eksperimen SSR Next via `@lit-labs/ssr` + Declarative Shadow DOM
- [ ] Pertimbangkan website docs terpisah (Docusaurus) jika Storybook tidak cukup

---

## 4. Definition of Done — per komponen

Sebuah komponen dinyatakan "selesai" hanya jika:

1. Implementasi Lit + props/events typed + `reflect` untuk styling state
2. Styling 100% via CSS custom properties (tidak ada warna/spacing hardcode)
3. Test unit (Vitest, happy-dom) — interaksi/event juga diverifikasi lewat
   panel **Actions** di Storybook (browser asli) _(revisi unit-only: e2e
   Playwright dihapus)_
4. Aksesibilitas dasar: keyboard, focus-visible, ARIA yang benar, kontras token lolos
5. Story `*.stories.ts` + halaman MDX: deskripsi, contoh React, contoh Angular, catatan Next/Drupal
6. Entri API otomatis muncul dari CEM (props, events, slots, CSS custom properties)
7. Wrapper React ter-generate dan teruji smoke

---

## 5. Cara Konsumsi (ringkasan, untuk docs)

| Framework    | Muat sekali                                                                                                 | Pakai                                     |
| ------------ | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| React/Next   | `import 'wec-ui/define/wec-button.js'` atau `import { Button } from '@wec-ui/react'`                        | `<Button variant="primary" onClick={fn}>` |
| Angular ≥18  | `import { WecUiModule } from '@wec-ui/angular'` + `CUSTOM_ELEMENTS_SCHEMA`                                  | `<wec-button variant="primary">`          |
| Next.js      | sama dengan React; `'use client'` sudah otomatis via wrapper                                                | —                                         |
| Drupal 10/11 | `wec_ui.libraries.yml` (paket `drupal-library`) atau `js/define/wec-button.js` + `tokens.css` + `fonts.css` | `<wec-button>` di Twig                    |

---

## 6. Tooling Stack

`pnpm` · TypeScript strict · Vite (library mode) · Lit 3 · Style Dictionary · `@lit/react` · Vitest (unit, node + happy-dom) · Storybook 8 · Custom Elements Manifest · Changesets (fixed) · ESLint + Prettier · GitLab CI (stub)
_(Playwright dihapus pada revisi unit-only — lihat §7)_

---

## 7. Rebrand Telkomsel (v0.3.0) — pivota arah desain

Keputusan baru (di luar rencana awal) yang dieksekusi pada v0.3.0:

- **Token** diganti ke palet brand **Telkomsel**: `brand.primary #FF0025`
  (hover `#ED0226`), grey scale `tselGrey`, semantic (`#BC1D42`, `#008E53`,
  `#FDA22B`, `#0050AE`), token disabilitas (`#E9E8ED`/`#99A0A7`) — light + dark.
- **Font** brand: **Poppins** (7 weight) + **Telkomsel Batik** (regular/bold),
  asset dari project `rap` → `tokens/fonts/`, di-serve via
  `tokens/build/fonts.css` (`@font-face`, woff2+woff).
- **Komponen aktif: hanya `wec-button`** — varian `primary` | `outline`,
  state `disabled`; pill, tinggi 66px, Poppins Bold, full-width CTA capable.
  Sepuluh komponen lain dihapus beserta test/stories/MDX/define dan wrapper
  React/Angular-nya (regenerasi otomatis tinggal button).
- **Verifikasi visual** via design-to-code loop (render Chromium + tinjauan
  3 iterasi) — report: `.design-to-code/runs/20261013-123056/report.md`.
- **Keputusan test**: unit-only (Vitest, node + happy-dom); verifikasi
  interaksi/event lewat panel **Actions** Storybook; e2e Playwright dihapus.
- Komponen berikutnya (`input`, `select`, `tabs`, `modal`, dst.) dibangun
  mengikuti desain baru, satu per satu, dengan DoD §4.
