import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060c18',
          900: '#0a1020',
          800: '#0f1a30',
          700: '#142040',
          600: '#1a2850',
        },
        accent: {
          green: '#00e676',
          amber: '#ffab00',
          red:   '#ff5252',
          blue:  '#4fc3f7',
          cyan:  '#00bcd4',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
