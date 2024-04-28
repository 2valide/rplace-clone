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
        'UtilitiesBackground': 'rgba(0, 0, 0, 0.61)',
        'neonYellow': '#FFFF00',
        'brightTurquoise': '#40E0D0',
        'neonOrange': '#FFA500',
        'btnhover': '#2A7BD5'
      },
      boxShadow: {
        'neon': '0 0 0.5rem #fff, 0 0 0.5rem #fff, 0 0 2rem #FFA500, 0 0 0.8rem #FFA500, 0 0 2.8rem #FFA500, inset 0 0 1.3rem #FFA500', // Orange neon glow
      },
      height: {
        '90%': '90.45678%',
        '90%': '90%',

      },
      fontFamily: {
        'pixelFont': '"Press Start 2P", system-ui'
      }
    },
  },
  plugins: [],
};
