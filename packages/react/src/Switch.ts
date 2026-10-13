'use client';

/**
 * Wrapper React untuk <wec-switch>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers
 */
import * as React from 'react';
import { createComponent } from '@lit/react';
import { WecSwitch } from 'wec-ui/dist/components/atoms/wec-switch/wec-switch.js';

export const Switch = createComponent({
  react: React,
  tagName: 'wec-switch',
  elementClass: WecSwitch,
  events: {
    onWecChange: 'wec-change',
  },
  displayName: 'Switch',
});

export type SwitchProps = React.ComponentProps<typeof Switch>;
