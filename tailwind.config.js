/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: '#161311',
        gold: '#c9a24b',
        sand: '#f0ece7',
        'sand-light': '#f7f5f2',
        muted: '#8a8580',
      },
    },
  },
  plugins: [],
};
