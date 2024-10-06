/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary_maroon: "#66181E",
        highlight_pink: "#FCF2F3",
        primary_gray: "#565E6C",
        lightgray: "#9095A0",
        black: "#171A1F",
      },
    },
  },
  plugins: [],
};
