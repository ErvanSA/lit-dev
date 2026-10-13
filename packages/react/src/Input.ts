'use client';

/**
 * Wrapper React untuk <wec-input>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers
 */
import * as React from 'react';
import { createComponent } from '@lit/react';
import { WecInput } from 'wec-ui/dist/components/atoms/wec-input/wec-input.js';

export const Input = createComponent({
  react: React,
  tagName: 'wec-input',
  elementClass: WecInput,
  events: {
    onWecInput: 'wec-input',
    onWecChange: 'wec-change',
    onWecFocus: 'wec-focus',
    onWecBlur: 'wec-blur',
  },
  displayName: 'Input',
});

export type InputProps = React.ComponentProps<typeof Input>;
