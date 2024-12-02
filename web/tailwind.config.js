/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#00236D",
        green: "#009C41",
        gray: "#3F3F3F",
      },
      fontFamily: {
        body: ['"Montserrat"'],
        inter: ['"Inter"'],
      },
      backgroundImage: {
        food: "url('/background.svg')",
      },
    },
  },
  plugins: [],
};
