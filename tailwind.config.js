/** @type {import('tailwindcss').Config} */

/**
 * Workless — Tailwind Theme Configuration
 *
 */
const path = require('path');

module.exports = {
  darkMode: 'class',
  content: [
    path.join(__dirname, 'src/**/*.tsx'),
    path.join(__dirname, 'src/**/*.ts'),
    path.join(__dirname, 'src/**/*.html'),
    path.join(__dirname, 'public/**/*.html'),
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#e93504",
          light: "#eaf1ff",
          focus: "#e04806",
          "dark-light": "rgba(67,97,238,.15)",
        },
        accent: {
          DEFAULT: "#5f5af6",
          light: "#818cf8",
          focus: "#4d47f5",
        },
        slate: {
          150: "#e9eef5",
        },
        primary: {
          50: "#f5f5ff",
          100: "#e8e7fe",
          200: "#d8d6ff",
          300: "#b9b4fe",
          400: "#9588fc",
          500: "#846cf9",
          600: "#6338f0",
          700: "#5224db",
          800: "#451fb7",
          900: "#3a1b98",
          950: "#3a1b98",
        },
        navy: {
          50: "#e7e9ef",
          100: "#c2c9d6",
          200: "#a3adc2",
          300: "#697a9b",
          400: "#5c6b8a",
          450: "#465675",
          500: "#384766",
          700: "#26334d",
          800: "#202b40",
          900: "#192132",
          950: "#0e1726",
        },
        secondary: {
          DEFAULT: "#805dca",
          light: "#ebe4f7",
          "dark-light": "rgb(128 93 202 / 15%)",
        },
        success: {
          DEFAULT: "#00ab55",
          light: "#ddf5f0",
          "dark-light": "rgba(0,171,85,.15)",
        },
        danger: {
          DEFAULT: "#e7515a",
          light: "#fff5f5",
          "dark-light": "rgba(231,81,90,.15)",
        },
        warning: {
          DEFAULT: "#e2a03f",
          light: "#fff9ed",
          "dark-light": "rgba(226,160,63,.15)",
        },
        info: {
          DEFAULT: "#2196f3",
          light: "#e7f7ff",
          "dark-light": "rgba(33,150,243,.15)",
        },
        dark: {
          DEFAULT: "#3b3f5c",
          light: "#eaeaec",
          "dark-light": "rgba(59,63,92,.15)",
        },
        black: {
          DEFAULT: "#0e1726",
          light: "#e3e4eb",
          "dark-light": "rgba(14,23,38,.15)",
        },
        white: {
          DEFAULT: "#ffffff",
          light: "#e0e6ed",
          dark: "#888ea8",
        },
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        inter: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      fontSize: {
        "xs-plus": ["0.8125rem", { lineHeight: "1.125rem" }],
      },
      spacing: {
        4.5: "18px",
        5.5: "1.375rem",
      },
      minHeight: {
        "100vh": "100vh",
      },
      boxShadow: {
        "3xl": "0 2px 2px rgb(224 230 237 / 46%), 1px 6px 7px rgb(224 230 237 / 46%)",
      },
      typography: {
        DEFAULT: {
          css: {
            h1: { fontSize: "40px" },
            h2: { fontSize: "32px" },
            h3: { fontSize: "28px" },
            h4: { fontSize: "24px" },
            h5: { fontSize: "20px" },
            h6: { fontSize: "16px" },
          },
        },
      },
    },
  },
};
