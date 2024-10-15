/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        text: {
          DEFAULT: '#071d0f',
          dark: '#e2f8ea',
        },
        background: {
          DEFAULT: '#ebfaf1',
          dark: '#05140b',
        },
        primary: {
          DEFAULT: '#1aebd5',
          dark: '#0dfdbd',
        },
        secondary: {
          DEFAULT: '#7385f7',
          dark: '#081a8c',
        },
        accent: {
          DEFAULT: '#2a2aac',
          dark: '#5353d5',
        },
        buttonText: {
          DEFAULT: '#ffffff',
          dark: '#071d0f',
        },
      },
    },
  },
  plugins: [],
};
