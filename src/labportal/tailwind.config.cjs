/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0a4c9c',
          green: '#147d75',
          blueSoft: '#e6f0ff',
          greenSoft: '#e9f8ee',
        },
      },
    },
  },
  plugins: [],
};



