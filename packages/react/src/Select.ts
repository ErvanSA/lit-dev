'use client';

/**
 * Wrapper React untuk <wec-select>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers
 */
import * as React from 'react';
import { createComponent } from '@lit/react';
import { WecSelect } from 'wec-ui/dist/components/atoms/wec-select/wec-select.js';

export const Select = createComponent({
  react: React,
  tagName: 'wec-select',
  elementClass: WecSelect,
  events: {
    onWecChange: 'wec-change',
    onWecFocus: 'wec-focus',
    onWecBlur: 'wec-blur',
  },
  displayName: 'Select',
});

export type SelectProps = React.ComponentProps<typeof Select>;
