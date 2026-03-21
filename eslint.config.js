// @ts-check
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    // Fichiers ignorés globalement
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.spec.ts',
      'eslint.config.js',
      'postcss.config.js',
      'tailwind.config.js',
    ],
  },

  // ─── TypeScript (tous les .ts) ────────────────────────────────────────────
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended, ...tseslint.configs.stylistic, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Angular
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'amg', style: 'camelCase' }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'amg', style: 'kebab-case' }],
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/no-lifecycle-call': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/no-output-on-prefix': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/prefer-inject': 'error',

      // TypeScript strict
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // General
      'no-console': 'error',
      'no-debugger': 'error',
    },
  },

  // ─── Fichiers infra Node.js (server, bootstrap) — console autorisé ────────
  {
    files: ['**/server.ts', '**/main.ts', 'api/**/*.ts'],
    rules: { 'no-console': 'off' },
  },

  // ─── CMS app — préfixe `cms` autorisé pour les composants internes ────────
  {
    files: ['apps/amg-deco-cms/**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: ['amg', 'cms'], style: 'kebab-case' }],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: ['amg', 'cms'], style: 'camelCase' },
      ],
    },
  },

  // ─── HTML (templates Angular) ─────────────────────────────────────────────
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/use-track-by-function': 'warn',
      '@angular-eslint/template/alt-text': 'error',
      '@angular-eslint/template/interactive-supports-focus': 'error',
    },
  },

  // ─── Prettier (désactive les règles de formatage en conflit) ──────────────
  eslintConfigPrettier,
);
