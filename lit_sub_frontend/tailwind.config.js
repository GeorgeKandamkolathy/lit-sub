module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing:{
        '100':'30rem',
        '85': '85%'
      },
      maxWidth: {
        'max-w-40':'40%'
      },
      inset:{
        '27%' : '27%'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
