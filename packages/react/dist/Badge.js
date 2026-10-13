'use client';
/**
 * Wrapper React untuk <wec-badge>.
 *
 * DIGENERATE oleh tools/generate-wrappers/generate.mjs — jangan edit manual.
 * Jalankan ulang: pnpm gen:wrappers
 */
import * as React from 'react';
import { createComponent } from '@lit/react';
import { WecBadge } from 'wec-ui/dist/components/atoms/wec-badge/wec-badge.js';
export const Badge = createComponent({
    react: React,
    tagName: 'wec-badge',
    elementClass: WecBadge,
    displayName: 'Badge',
});
