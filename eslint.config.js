import lit from 'eslint-plugin-lit';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/storybook-static/**',
      '**/test-results/**',
      '**/playwright-report/**',
      '**/blob-report/**',
      '**/fixtures/react-bundle.js',
      'packages/core/custom-elements.json',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/tests/**/*.{ts,mts}', '**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.mts', '**/*.tsx'],
    plugins: { lit },
    rules: {
      ...(lit.configs?.['flat/recommended']?.rules ?? {}),
      'lit/binding-positions': 'error',
      'lit/no-duplicate-template-bindings': 'error',
      'lit/no-invalid-html': 'error',
      'lit/no-legacy-template-syntax': 'error',
      'lit/no-property-change-update': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
);
