import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0EA5A4",
          dark: "#0B8C8B",
        },
        accent: "#38BDF8",
        navy: "#0B1F33",
        "navy-2": "#102A43",
        background: "#F6F8FB",
        surface: "#FFFFFF",
        border: "#E5EAF0",
        muted: "#E5EAF0",
        text: "#0F172A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        "card-lg": "16px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(11, 31, 51, 0.08)",
        "card-hover": "0 4px 24px rgba(11, 31, 51, 0.14)",
      },
      backgroundOpacity: {
        "8": "0.08",
      },
    },
  },
  plugins: [],
};

export default config;
