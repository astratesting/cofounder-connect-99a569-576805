import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#070B1A',
        ink: '#0F172A',
        brand: '#7C3AED',
        coral: '#FB7185',
        mint: '#2DD4BF'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(124, 58, 237, 0.25)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};

export default config;
