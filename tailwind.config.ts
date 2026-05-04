import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        card: 'var(--card)',
        border: 'var(--border)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-light': 'var(--accent-light)'
      },
      boxShadow: {
        glass: '0 4px 24px rgba(0, 0, 0, 0.06)',
        'glass-dark': '0 4px 24px rgba(0, 0, 0, 0.3)'
      }
    }
  },
  darkMode: ['class'],
  plugins: []
};

export default config;
