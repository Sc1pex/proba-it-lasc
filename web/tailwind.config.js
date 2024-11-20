/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#00236D",
      },
      fontFamily: {
        body: ['"Montserrat"'],
      },
    },
  },
  plugins: [],
};
