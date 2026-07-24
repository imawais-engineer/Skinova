import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skinova: {
          ink: "#050812",
          panel: "#0d1224",
          line: "#1f2a44",
          cyan: "#29d3ff",
          mint: "#36f5a8",
          rose: "#ff6fae",
          violet: "#8b7dff"
        }
      },
      boxShadow: {
        glow: "0 0 60px rgba(41, 211, 255, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
