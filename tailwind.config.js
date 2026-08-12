/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: '#161311',
        accent: '#4f46e5',
        sand: '#f0ece7',
        'sand-light': '#f7f5f2',
        muted: '#8a8580',
      },
      // Everything read as too small — bump the whole semantic scale up
      // proportionally (~15%) rather than one-off overrides, so text-xs
      // through text-2xl all grow together and stay visually distinct.
      fontSize: {
        xs: '14px',
        sm: '16px',
        base: '18px',
        lg: '20px',
        xl: '22px',
        '2xl': '28px',
      },
      // Semantic spacing scale — gestalt-driven rhythm: tighter gaps within a
      // single group of related info (a card's own name/rating/tags stack),
      // wider gaps between distinct groups (selector row to the rail below
      // it, header to hero, section to section), so grouping reads visually
      // instead of everything looking equally (un)related.
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
      },
    },
  },
  plugins: [],
};
