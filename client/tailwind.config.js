/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        damion: ['Damion', 'cursive'],
      },
    },
  },
  plugins: [],
  // Blocklist patterns that shouldn't generate CSS
  blocklist: [
    /^bg-\[url\(''\)\]/, // Prevent empty URL classes
    /^bg-\[url\(""\)\]/, // Prevent empty URL classes with double quotes
  ],
};
