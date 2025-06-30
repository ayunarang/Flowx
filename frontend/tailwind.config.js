/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'subtle': '0 0px 8px rgba(0, 0, 0, 0.1)',
        'deep': '0 8px 24px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}

