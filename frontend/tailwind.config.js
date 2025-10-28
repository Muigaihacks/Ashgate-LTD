/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // AshGate Brand Colors (from business card)
        primary: {
          50: '#fdf6f0',
          100: '#f9e6d3',
          200: '#f2c9a3',
          300: '#e8a56b',
          400: '#d2691e', // Main brand color
          500: '#cd853f',
          600: '#8b4513', // Darker brown
          700: '#6b3410',
          800: '#4a2c0b',
          900: '#2d1a06',
        },
        secondary: {
          50: '#f5f5dc', // Cream background
          100: '#e8e8c4',
          200: '#d1d1a8',
          300: '#b8b88c',
          400: '#9f9f70',
          500: '#868654',
          600: '#6d6d38',
          700: '#54541c',
          800: '#3b3b00',
          900: '#222200',
        },
        accent: {
          50: '#f0f8f0',
          100: '#d9e6d9',
          200: '#b3ccb3',
          300: '#8db38d',
          400: '#679967',
          500: '#2f4f2f', // Dark green text
          600: '#264026',
          700: '#1d301d',
          800: '#132013',
          900: '#0a100a',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
