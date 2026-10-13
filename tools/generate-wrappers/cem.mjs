/**
 * Helper bersama untuk membaca Custom Elements Manifest — dipakai generator
 * React dan Angular.
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const HERE = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_MANIFEST = resolve(HERE, '../../packages/core/custom-elements.json');

/** 'wec-form-field' → 'FormField' (prefix `wec-` dibuang). */
export function tagNameToComponentName(tagName) {
  const parts = tagName.split('-').filter(Boolean);
  if (parts[0]?.toLowerCase() === 'wec') {
    parts.shift();
  }
  if (parts.length === 0) {
    throw new Error(`Nama tag tidak valid: ${tagName}`);
  }
  return parts.map((part) => part[0].toUpperCase() + part.slice(1)).join('');
}

/** 'wec-input' → 'onWecInput'; 'click' → 'onClick'. */
export function eventNameToHandler(event) {
  return (
    'on' +
    event
      .split('-')
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join('')
  );
}

/** 'wec-input' → 'wecInput' (nama @Output Angular). */
export function eventNameToOutput(event) {
  const withoutOn = eventNameToHandler(event).replace(/^on/, '');
  return withoutOn[0].toLowerCase() + withoutOn.slice(1);
}

/** 'src/components/atoms/wec-button/wec-button.ts' → 'wec-ui/dist/.../wec-button.js'. */
export function modulePathToImport(modulePath) {
  const jsPath = modulePath.replace(/^src\//, '').replace(/\.ts$/, '.js');
  return `wec-ui/dist/${jsPath}`;
}

/**
 * Kumpulkan semua custom element dari manifest.
 * @returns Array<{ tagName, declarationName, modulePath, declaration }>
 */
export function collectCustomElements(manifest) {
  const elements = [];
  for (const module of manifest.modules ?? []) {
    for (const exportEntry of module.exports ?? []) {
      if (exportEntry.kind !== 'custom-element-definition') continue;
      const tagName = exportEntry.name;
      const declarationName = exportEntry.declaration?.name;
      if (!tagName || !declarationName || !module.path) continue;

      const declaration = (module.declarations ?? []).find((d) => d.name === declarationName);
      elements.push({
        tagName,
        declarationName,
        modulePath: module.path,
        declaration,
      });
    }
  }
  return elements.sort((a, b) => a.tagName.localeCompare(b.tagName));
}
