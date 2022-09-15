
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require('tailwind-scrollbar')],
  darkMode: 'class'
};
