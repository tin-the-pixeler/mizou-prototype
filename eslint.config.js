import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';
import tailwind from 'eslint-plugin-tailwindcss';

// Absolute path: the plugin resolves the tailwindcss package relative to the
// config's own directory, which fails for a bare relative path.
const TAILWIND_CONFIG = fileURLToPath(new URL('./tailwind.config.ts', import.meta.url));

/**
 * Lint scope is the new design-system layer only (`ui/`, `stories/ui/`).
 * The existing components/, styles/ and stories/ are intentionally NOT linted —
 * this config is additive and must not create noise on untouched code.
 */
export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'storybook-static/**',
      'components/**',
      'styles/**',
      'stories/*.stories.ts',
      'stories/*.ts',
      'figma-plugin-rename/**',
    ],
  },
  {
    files: ['ui/**/*.{ts,tsx}', 'stories/ui/**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
    plugins: { tailwindcss: tailwind },
    settings: {
      tailwindcss: {
        config: TAILWIND_CONFIG,
        callees: ['cn', 'clsx', 'cva', 'twMerge'],
        classRegex: '^class(Name)?$',
      },
    },
    rules: {
      // THE TOKEN GATE: `p-[13px]`, `text-[#4f46e5]`, `w-[42rem]` etc. are
      // errors. Every value must come from the scale in tailwind.config.ts,
      // which is itself derived from styles/tokens.css.
      'tailwindcss/no-arbitrary-value': 'error',

      // Supporting rules: catch class names that don't exist in the theme at
      // all, and contradictory/duplicate utilities.
      'tailwindcss/no-custom-classname': 'warn',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/enforces-shorthand': 'warn',
    },
  },
);
