'use client';
/**
 * Wrapper React untuk <wec-form-field>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers
 */
import * as React from 'react';
import { createComponent } from '@lit/react';
import { WecFormField } from 'wec-ui/dist/components/molecules/wec-form-field/wec-form-field.js';
export const FormField = createComponent({
    react: React,
    tagName: 'wec-form-field',
    elementClass: WecFormField,
    displayName: 'FormField',
});
