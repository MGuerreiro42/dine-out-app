import tokens from './tokens';

// Typed re-export of tokens.js for component code — `import { colors, iconSize } from
// '@/theme'` for anything that needs a raw JS value (an icon's `color`/`size` prop, an
// inline `style=` object). className-based styling uses the matching Tailwind classes
// (tailwind.config.js requires the same tokens.js, so the two can't drift apart).
export const colors = tokens.colors;
export const spacing = tokens.spacing;
export const iconSize = tokens.iconSize;
export const radius = tokens.radius;
