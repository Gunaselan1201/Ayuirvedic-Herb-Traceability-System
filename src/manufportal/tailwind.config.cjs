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
          blue: '#2563eb',
          green: '#16a34a',
          blueSoft: '#e6f0ff',
          greenSoft: '#e9f8ee',
        },
      },
    },
  },
  plugins: [],
};



