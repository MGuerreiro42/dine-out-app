// Single source of truth for design tokens — required directly by tailwind.config.js
// (so className-based styling and raw-JS-value styling, e.g. an icon's `color`/`size`
// prop, can never drift out of sync) and re-exported typed from ./index.ts for
// component code. Plain CJS, not TS, because tailwind.config.js requires it with no
// build step.
module.exports = {
  colors: {
    ink: '#161311',
    inkMuted: '#6b6459',
    inkFaint: '#8a8580',
    inkSubtle: '#b3aca2',
    sand: '#f0ece7',
    sandLight: '#f7f5f2',
    sandBorder: '#e5ded2',
    accent: '#4f46e5',
    accentPressed: '#6366f1',
    accentTint: '#e0e7ff',
    rating: '#fbbf24',
    danger: '#e11d48',
    dangerTint: '#fee2e2',
    success: '#16a34a',
    successTint: '#dcfce7',
    // Map "you are here" pin only — a documented exception, not folded into accent
    // (matches the platform map-pin convention rather than the brand's own hue).
    locate: '#208aef',
    white: '#ffffff',
  },
  spacing: {
    xs: 4,
    sm: 8,
    sm2: 12,
    md: 16,
    md2: 20,
    lg: 24,
    xl: 32,
    '2xl': 40,
  },
  // No Tailwind concept of "icon size" — these are consumed as raw numbers via
  // Icon.tsx's `size` prop, never as className.
  iconSize: {
    micro: 12, // inline badges (distance chips, tiny inline signals)
    inline: 16, // meta icons sitting next to body text
    ui: 20, // default control/button icons
    header: 24, // header and primary-action icons
    empty: 32, // empty-state illustrations
  },
  // rounded-full stays a literal Tailwind class for true pills/avatars/toggles —
  // not part of this scale.
  radius: {
    sm: 8,
    lg: 16,
  },
};
