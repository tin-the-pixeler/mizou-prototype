import type { Config } from 'tailwindcss';

/**
 * Mizou design-system Tailwind theme.
 *
 * Every value below is sourced from the repo's existing token files —
 * `styles/tokens.css` and `styles/app-typography.css` (Figma → Type System [App]).
 * Nothing here is invented or approximated.
 *
 * Utilities resolve to `var(--token)` so Tailwind and the legacy CSS stay in
 * lockstep: change tokens.css and both update. The literal hex values are kept
 * in the `mizouTokens` export below purely so the Foundations story can display
 * the resolved value next to each swatch.
 */

/** Literal values, mirrored from styles/tokens.css for documentation/display. */
export const mizouTokens = {
  slate: {
    1: '#fcfcfd',
    2: '#f9f9fb',
    3: '#f2f2f5',
    4: '#ebebef',
    5: '#e4e4e9',
    6: '#dddde3',
    7: '#d3d4db',
    8: '#b9bbc6',
    9: '#8b8d98',
    10: '#7e808a',
    11: '#60646c',
    12: '#1c2024',
  },
  indigo: { dark: '#3730a3', base: '#4f46e5', light: '#a5b4fc' },
  rose: { dark: '#be123c', base: '#f43f5e', light: '#fecdd3' },
  emerald: { dark: '#065f46', base: '#34d399', light: '#d1fae5' },
  amber: { dark: '#d97706', base: '#fbbf24', light: '#fde68a' },
  black: '#000000',
  white: '#ffffff',
} as const;

/** Spacing scale — styles/tokens.css `--spacing-*`. */
export const mizouSpacing = {
  '3xs': '4px',
  '2xs': '8px',
  xs: '12px',
  sm: '16px',
  md: '24px',
  lg: '32px',
} as const;

/** Radius scale — styles/tokens.css `--radius-*`. */
export const mizouRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '999px',
} as const;

/** Shadows — styles/tokens.css `--shadow-*`. */
export const mizouShadows = {
  1: '0 1px 0 rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.05)',
  md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

/**
 * App type scale — styles/app-typography.css (Figma → Type System [App]).
 * Tuple form: [fontSize, { lineHeight, letterSpacing, fontWeight }].
 */
export const mizouTypeScale = {
  h1: ['45px', { lineHeight: '54px', letterSpacing: '-0.63px', fontWeight: '800' }],
  h2: ['38px', { lineHeight: '48px', letterSpacing: '-0.42px', fontWeight: '700' }],
  h3: ['32px', { lineHeight: '42px', letterSpacing: '-0.24px', fontWeight: '700' }],
  h4: ['27px', { lineHeight: '36px', letterSpacing: '-0.09px', fontWeight: '700' }],
  lead: ['27px', { lineHeight: '36px', letterSpacing: '-0.09px', fontWeight: '400' }],
  lg: ['19px', { lineHeight: '30px', letterSpacing: '0.15px', fontWeight: '400' }],
  base: ['16px', { lineHeight: '24px', letterSpacing: '0.24px', fontWeight: '400' }],
  sm: ['13px', { lineHeight: '18px', letterSpacing: '0.33px', fontWeight: '400' }],
  xs: ['11px', { lineHeight: '18px', letterSpacing: '0.39px', fontWeight: '500' }],
} as const;

const config: Config = {
  // Scoped to the new design-system layer only. Existing components/ and
  // stories/ are deliberately excluded so Tailwind never scans or affects them.
  content: ['./ui/**/*.{ts,tsx}', './stories/ui/**/*.{ts,tsx,mdx}'],

  // Preflight is OFF. Tailwind's reset would restyle buttons, headings, lists
  // and borders across all 52 existing HTML stories. Off = purely additive.
  corePlugins: { preflight: false },

  theme: {
    // These keys sit at THIS level, not under `extend`, so they REPLACE
    // Tailwind's defaults rather than adding to them. Extending would leave
    // `p-4`, `h-16`, `bg-red-500` etc. usable — a second escape hatch around
    // the token scale that no-arbitrary-value cannot catch.
    colors: {
      // Keywords Tailwind needs to stay functional.
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      black: 'var(--primitive-black)',
      white: 'var(--primitive-white)',

      // --- primitives (styles/tokens.css → --primitive-*) ---
      slate: {
        1: 'var(--primitive-slate-1)',
        2: 'var(--primitive-slate-2)',
        3: 'var(--primitive-slate-3)',
        4: 'var(--primitive-slate-4)',
        5: 'var(--primitive-slate-5)',
        6: 'var(--primitive-slate-6)',
        7: 'var(--primitive-slate-7)',
        8: 'var(--primitive-slate-8)',
        9: 'var(--primitive-slate-9)',
        10: 'var(--primitive-slate-10)',
        11: 'var(--primitive-slate-11)',
        12: 'var(--primitive-slate-12)',
      },
      indigo: {
        dark: 'var(--primitive-indigo-dark)',
        DEFAULT: 'var(--primitive-indigo-base)',
        light: 'var(--primitive-indigo-light)',
      },
      rose: {
        dark: 'var(--primitive-rose-dark)',
        DEFAULT: 'var(--primitive-rose-base)',
        light: 'var(--primitive-rose-light)',
      },
      emerald: {
        dark: 'var(--primitive-emerald-dark)',
        DEFAULT: 'var(--primitive-emerald-base)',
        light: 'var(--primitive-emerald-light)',
      },
      amber: {
        dark: 'var(--primitive-amber-dark)',
        DEFAULT: 'var(--primitive-amber-base)',
        light: 'var(--primitive-amber-light)',
      },

      // --- semantic aliases ---
      surface: {
        page: 'var(--surface-page)',
        raised: 'var(--surface-raised)',
        emphasis: 'var(--surface-emphasis)',
        overlay: 'var(--surface-overlay)',
        sunken: 'var(--surface-sunken)',
      },
      stroke: {
        subtle: 'var(--border-subtle)',
        DEFAULT: 'var(--border-default)',
        strong: 'var(--border-strong)',
        divider: 'var(--border-divider)',
        contrast: 'var(--border-contrast)',
        button: 'var(--border-button)',
      },
      content: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        inverse: 'var(--text-inverse)',
      },
      icon: { DEFAULT: 'var(--icon-fill-default)' },
      interactive: {
        primary: 'var(--interactive-primary)',
        'primary-hover': 'var(--interactive-primary-hover)',
        'primary-active': 'var(--interactive-primary-active)',
        secondary: 'var(--interactive-secondary)',
        'secondary-hover': 'var(--interactive-secondary-hover)',
        'secondary-active': 'var(--interactive-secondary-active)',
        'secondary-clicked': 'var(--interactive-secondary-clicked)',
      },
      feedback: {
        info: 'var(--feedback-info)',
        'info-bg': 'var(--feedback-info-bg)',
        'info-bg-subtle': 'var(--feedback-info-bg-subtle)',
        success: 'var(--feedback-success)',
        'success-bg': 'var(--feedback-success-bg)',
        error: 'var(--feedback-error)',
        'error-bg': 'var(--feedback-error-bg)',
        warning: 'var(--feedback-warning)',
        'warning-bg': 'var(--feedback-warning-bg)',
      },
      scrim: 'var(--overlay-scrim)',
    },

    spacing: mizouSpacing,

    borderRadius: {
      none: '0',
      ...mizouRadius,
      input: 'var(--radius-input)',
      modal: 'var(--radius-modal)',
      container: 'var(--radius-container)',
    },

    fontSize: mizouTypeScale as unknown as Record<string, [string, Record<string, string>]>,

    // Standard Tailwind weight scale (medium=500, semibold=600), NOT the
    // legacy --fw-medium:600 remap in styles/tokens.css. That token is shared
    // by 17 existing CSS files — changing its value there would restyle all
    // of them. Scoping the standard scale here instead keeps ui/ on Tailwind's
    // own convention without touching the legacy layer.
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },

    boxShadow: { none: 'none', ...mizouShadows },

    extend: {
      // Additive only — these have no conflicting default worth locking down.
      fontFamily: {
        sans: [
          'Nunito Sans', 'ui-sans-serif', 'system-ui', '-apple-system',
          'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif',
        ],
      },
      backgroundImage: { 'ocean-diagonal': 'var(--ocean-gradient-diagonal)' },
      opacity: { disabled: '0.5' },
    },
  },

  plugins: [],
};

export default config;
