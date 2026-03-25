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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%':       { transform: 'rotate(5deg)' },
        },
      },
      animation: {
        sway: 'sway 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
