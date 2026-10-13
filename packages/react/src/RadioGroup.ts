'use client';

/**
 * Wrapper React untuk <wec-radio-group>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers
 */
import * as React from 'react';
import { createComponent } from '@lit/react';
import { WecRadioGroup } from 'wec-ui/dist/components/atoms/wec-radio-group/wec-radio-group.js';

export const RadioGroup = createComponent({
  react: React,
  tagName: 'wec-radio-group',
  elementClass: WecRadioGroup,
  events: {
    onWecChange: 'wec-change',
  },
  displayName: 'RadioGroup',
});

export type RadioGroupProps = React.ComponentProps<typeof RadioGroup>;
