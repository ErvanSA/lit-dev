import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/**/tests/unit/**/*.test.ts', 'tools/**/test/**/*.test.mjs'],
    environment: 'node',
  },
});
