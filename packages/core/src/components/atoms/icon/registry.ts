/*
 * DIGENERATE oleh tools/icons/generate.mjs — jangan edit manual.
 * Sumber: tools/icons/svg/*.svg. Jalankan ulang: pnpm build:icons
 */

/** Nama ikon yang tersedia di registry. */
export type WecIconName = 'check' | 'close';

/** Registry ikon: nama → markup SVG. */
export const icons: Record<WecIconName, string> = {
  check:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  close:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
};
