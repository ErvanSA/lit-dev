# Changesets — wec-ui

Semua package memakai **fixed mode** (`wec-ui` + `@wec-ui/react` selalu satu versi).
Belum dipublish ke registry — changelog internal saja.

## Alur kerja

1. Setelah perubahan yang relevan (fitur/fix/breaking), tambahkan changeset:
   ```bash
   pnpm changeset
   ```
2. Saat siap rilis internal, bump versi + update CHANGELOG:
   ```bash
   pnpm version:pkg
   ```
