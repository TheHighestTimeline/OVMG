/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dce5ff',
          400: '#748ffc',
          500: '#3b5bdb',
          600: '#3451c7',
          700: '#2c44b0',
          900: '#1a2a6b',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
