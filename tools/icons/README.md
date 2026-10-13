# tools/icons

Sumber ikon SVG custom dari tim desain + generator registry TypeScript.

## Alur kerja

1. Drop file SVG baru ke folder `svg/` (penamaan bebas, otomatis diubah ke kebab-case,
   mis. `Arrow Right.svg` → `arrow-right`).
2. Jalankan dari root repo:
   ```
   pnpm build:icons
   ```
3. Output: `packages/core/src/components/atoms/icon/registry.ts` berisi
   `WecIconName` (union type) + `icons` (nama → markup SVG). File ini **digenerate —
   jangan edit manual**.

## Aturan SVG

- Satu warna via `currentColor` agar mengikuti warna teks komponen.
- `viewBox` konsisten (target: 24×24, stroke 2 — sesuaikan dengan keputusan desain).
- Tanpa `width`/`height` fixed (ukuran dikendalikan komponen `wec-icon`, Fase 1).

## Nama duplikat

Dua file yang menghasilkan nama kebab-case sama akan menggagalkan generator dengan pesan
eksplisit — perbaiki nama file lalu jalankan ulang.
