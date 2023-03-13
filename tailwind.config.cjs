/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        themePrimary: "#37306B",
        themeBlack: "#222222",
        themeTurkish: "#22A39F",
        themeGrey: "#434242",
        themeWhite: "#F3EFE0",
      },
    },
  },
  plugins: [],
};

module.exports = config;
