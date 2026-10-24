import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    fontSize: {
      '3xs': ['0.5rem', '0.5625rem'],
      '2xs': ['0.625rem', '0.75rem'],
      xs: ['0.75rem', '0.875rem'],
      sm: ['0.875rem', '1.0625rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.25rem', '1.5625rem'],
      xl: ['1.5rem', '1.875rem'],
      '2xl': ['2rem', '2.5rem'],
      '3xl': ['2.5rem', '3.125rem'],
      '4xl': ['3rem', '3.625rem'],
      '5xl': ['3.5rem', '4.1875rem'],
    },
    fontFamily: {
      main: ['var(--brand-font)', 'sans-serif'],
      sub: ['var(--brand-font)', 'sans-serif'],
      brand: ['var(--brand-font)', 'sans-serif'],
    },
    fontWeight: {
      light: '300',
      regular: '400',
      'semi-bold': '500',
      bold: '600',
    },
    colors: {
      transparent: 'transparent',
      white: '#FFFFFF',
      light: {
        400: '',
        500: '',
        600: '',
      },
      black: '#000000',
      dark: {
        400: '',
        500: '',
        600: '',
      },
      primary: {
        400: '',
        500: 'var(--brand-primary)',
        600: '',
      },
      success: {
        400: '',
        500: '',
        600: '',
      },
      warning: {
        400: '',
        500: '',
        600: '',
      },
      alert: {
        400: '',
        500: '',
        600: '',
      },
      brand: {
        primary: 'var(--brand-primary)',
        secondary: 'var(--brand-secondary)',
        accent: 'var(--brand-accent)',
        bg: 'var(--brand-bg)',
        text: 'var(--brand-text)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
