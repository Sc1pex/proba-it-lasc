/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#00236D",
        green: "#009C41",
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
