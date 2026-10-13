import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const componentEntry = (tag: string) =>
  fileURLToPath(new URL(`./src/define/${tag}.ts`, import.meta.url));

export default defineConfig({
  // Sajikan token desain di dev server (fixture e2e + index.html playground)
  publicDir: fileURLToPath(new URL('../../tokens/build', import.meta.url)),
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
    minify: false,
    // tokens.css di-serve dev saja; jangan tersalin ke dist paket
    copyPublicDir: false,
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        'define/wec-badge': componentEntry('wec-badge'),
        'define/wec-button': componentEntry('wec-button'),
        'define/wec-card': componentEntry('wec-card'),
        'define/wec-checkbox': componentEntry('wec-checkbox'),
        'define/wec-form-field': componentEntry('wec-form-field'),
        'define/wec-icon': componentEntry('wec-icon'),
        'define/wec-input': componentEntry('wec-input'),
        'define/wec-radio-group': componentEntry('wec-radio-group'),
        'define/wec-select': componentEntry('wec-select'),
        'define/wec-switch': componentEntry('wec-switch'),
        'define/wec-textarea': componentEntry('wec-textarea'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^lit/],
      output: {
        // dist mempertahankan struktur src/ — wrapper React (digenerate dari CEM)
        // mengimpor per-modul: wec-ui/dist/components/.../wec-*.js
        preserveModules: true,
        preserveModulesRoot: fileURLToPath(new URL('./src', import.meta.url)),
        entryFileNames: '[name].js',
      },
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
