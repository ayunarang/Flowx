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
        colors: {
        canvas: {
          white: '#FFFFFF',
          beige: '#F5F5DC',
          ivory: '#F8F4E3',
          gray: '#DCDCDC',
          charcoal: '#4F4F4F',
          ink: '#1C1C1C',
          dustyRose: '#D8A7A7',
          terracotta: '#B85C38',
          sage: '#A8B9A0',
          sky: '#AFCBFF',
          mustard: '#E1B866',
          navy: '#324A5E',
        },
        canvaPurple: '#8A2BE2', 
      },
    },
  },
  plugins: [],
}

