/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/img/background.jpg')",
      },
      colors: {
        'MainContentBackground': 'rgba(245, 245, 245, 0.47)',
        'UtilitiesBackground': 'rgba(0, 0, 0, 0.61)'
      },
      height: {
        '90%': '90.45678%',
        '90%': '90%',

      }
    },
  },
  plugins: [],
};
