/** @type {import('tailwindcss').Config} */
const tokens = require('./src/theme/tokens');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Sourced from src/theme/tokens.js — the same module tailwind.config.js and
      // component code both read, so className tokens and raw-JS-value tokens
      // (an icon's `color` prop, which className can never reach) can't drift
      // apart. Original names (ink/accent/sand/sand-light/muted) kept as aliases
      // so every existing className stays valid.
      colors: {
        ink: tokens.colors.ink,
        'ink-muted': tokens.colors.inkMuted,
        'ink-faint': tokens.colors.inkFaint,
        'ink-subtle': tokens.colors.inkSubtle,
        accent: tokens.colors.accent,
        'accent-pressed': tokens.colors.accentPressed,
        'accent-tint': tokens.colors.accentTint,
        sand: tokens.colors.sand,
        'sand-light': tokens.colors.sandLight,
        'sand-border': tokens.colors.sandBorder,
        muted: tokens.colors.inkFaint,
        rating: tokens.colors.rating,
        danger: tokens.colors.danger,
        'danger-tint': tokens.colors.dangerTint,
        success: tokens.colors.success,
        'success-tint': tokens.colors.successTint,
        locate: tokens.colors.locate,
      },
      // Everything read as too small — bump the whole semantic scale up
      // proportionally (~15%) rather than one-off overrides, so text-xs
      // through text-2xl all grow together and stay visually distinct.
      // `body`/`caption` are real, already-dominant sizes (15px/13px) that
      // used to live only as untracked arbitrary text-[15px]/text-[13px].
      fontSize: {
        xs: '14px',
        caption: '13px',
        sm: '16px',
        body: '15px',
        base: '18px',
        lg: '20px',
        xl: '22px',
        '2xl': '28px',
      },
      // Semantic spacing scale — gestalt-driven rhythm: tighter gaps within a
      // single group of related info (a card's own name/rating/tags stack),
      // wider gaps between distinct groups (selector row to the rail below
      // it, header to hero, section to section), so grouping reads visually
      // instead of everything looking equally (un)related. sm2/md2 close the
      // two real gaps the original 6-step scale left (12px/20px were the
      // most common arbitrary values with no token to round to).
      spacing: {
        xs: '4px',
        sm: '8px',
        sm2: '12px',
        md: '16px',
        md2: '20px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
      },
      // 8px (inputs, small controls) and 16px (cards, sheets, primary buttons).
      // rounded-full stays a plain Tailwind class, reserved for true
      // avatars/tags/toggles — not part of this scale.
      borderRadius: {
        sm: `${tokens.radius.sm}px`,
        lg: `${tokens.radius.lg}px`,
      },
    },
  },
  plugins: [],
};
