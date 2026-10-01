import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: {
          DEFAULT: 'var(--bg-surface)',
          elevated: 'var(--bg-surface-elevated)',
        },
        ink: {
          DEFAULT: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
          light: 'var(--accent-light)',
        },
        line: {
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs: '2px',
        sm: '4px',
        md: '6px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(18, 19, 20, 0.04)',
        card: '0 12px 32px -8px rgba(18, 19, 20, 0.06)',
        lifted: '0 20px 48px -12px rgba(18, 19, 20, 0.08)',
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight: '-0.02em',
        clinical: '0.08em',
      },
    },
  },
  plugins: [],
};

export default config;
