/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#064e3b',
          light: '#065f46',
          dark: '#022c22'
        },
        accent: {
          DEFAULT: '#d97706',
          light: '#fbbf24',
          dark: '#b45309'
        }
      },
      borderRadius: {
        'sm': '2px',
        'md': '4px',
        'lg': '8px',
      }
    },
  },
  plugins: [],
}
