'use client';
/**
 * Wrapper React untuk <wec-card>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers
 */
import * as React from 'react';
import { createComponent } from '@lit/react';
import { WecCard } from 'wec-ui/dist/components/molecules/wec-card/wec-card.js';
export const Card = createComponent({
    react: React,
    tagName: 'wec-card',
    elementClass: WecCard,
    displayName: 'Card',
});
