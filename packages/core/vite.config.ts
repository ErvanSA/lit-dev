import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
    minify: false,
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        'define/wec-button': fileURLToPath(new URL('./src/define/wec-button.ts', import.meta.url)),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^lit/],
    },
  },
  plugins: [
    dts({
      entryRoot: 'src',
      include: ['src'],
      exclude: ['**/*.stories.ts'],
    }),
  ],
});
