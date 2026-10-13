'use client';

/**
 * Wrapper React untuk <wec-checkbox>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers
 */
import * as React from 'react';
import { createComponent } from '@lit/react';
import { WecCheckbox } from 'wec-ui/dist/components/atoms/wec-checkbox/wec-checkbox.js';

export const Checkbox = createComponent({
  react: React,
  tagName: 'wec-checkbox',
  elementClass: WecCheckbox,
  events: {
    onWecChange: 'wec-change',
  },
  displayName: 'Checkbox',
});

export type CheckboxProps = React.ComponentProps<typeof Checkbox>;
