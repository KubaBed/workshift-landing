import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Build output, tooling agentów (per-developer) i katalogi z materiałami poza kodem strony.
  globalIgnores(['dist', '.agents', '.claude', 'skills', 'docs', 'assets', 'offers', '_archive', 'src/lib/ogl']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Kod uruchamiany w Node (Vercel Functions, skrypty build/marketing, generatory PDF).
    files: ['api/**/*.js', 'scripts/**/*.{js,mjs}', 'lead-magnets/**/*.mjs', 'vite.config.js', 'vite-api-middleware.mjs'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
