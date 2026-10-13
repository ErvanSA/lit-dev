/* eslint-disable */
'use client';
/**
 * Wrapper React untuk <wec-button>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers
 */
import * as React from 'react';
import { createComponent } from '@lit/react';
import { WecButton } from 'wec-ui/dist/components/atoms/wec-button/wec-button.js';
export const WecButton = createComponent({
    react: React,
    tagName: 'wec-button',
    elementClass: WecButton,
    events: {
        onClick: 'click',
    },
    displayName: 'WecButton',
});
