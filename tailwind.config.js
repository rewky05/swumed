/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary_maroon: "#66181E",
        light_maroon: "#961F28",
        highlight_pink: "#FCF2F3",
        primary_gray: "#231F20",
        lightgray: "#9095A0",
        black: "#171A1F",
      },
    },
  },
  plugins: [],
};
