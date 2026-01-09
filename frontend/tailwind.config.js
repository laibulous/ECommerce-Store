/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        charcoal: '#1F2933',

        /* SimpleFinds brand palette (Sage-based) */
        primary: {
          50: '#F4F8F6',
          100: '#E3EFEA',
          200: '#CFE3DB',
          300: '#AFCFC3',
          400: '#8BB7A7',
          500: '#6B9080',   // MAIN brand color
          600: '#557A6E',   // Primary buttons
          700: '#3E5F55',   // Hover states
          800: '#2F4A43',
          900: '#1F3530',
        },

        /* Optional soft neutral accent */
        sand: '#F3EFEA',
        darkSand: '#EDF2CB'
      }
    },
  },
  plugins: [],
}
