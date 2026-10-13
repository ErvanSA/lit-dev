'use client';

/**
 * Wrapper React untuk <wec-textarea>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers
 */
import * as React from 'react';
import { createComponent } from '@lit/react';
import { WecTextarea } from 'wec-ui/dist/components/atoms/wec-textarea/wec-textarea.js';

export const Textarea = createComponent({
  react: React,
  tagName: 'wec-textarea',
  elementClass: WecTextarea,
  events: {
    onWecInput: 'wec-input',
    onWecChange: 'wec-change',
    onWecFocus: 'wec-focus',
    onWecBlur: 'wec-blur',
  },
  displayName: 'Textarea',
});

export type TextareaProps = React.ComponentProps<typeof Textarea>;
