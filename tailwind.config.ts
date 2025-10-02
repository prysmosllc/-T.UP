import { frostedThemePlugin } from "@whop/react/tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // T.UP Brand Colors
        'stellar': '#1A2B48',
        'teal': '#00C49A',
        'gold': '#FFC700',
        'light-grey': '#F5F5F7',
        'medium-grey': '#A0AEC0',
        'dark-grey': '#4A5568',
        'brand-black': '#1A202C',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [frostedThemePlugin()],
};

export default config;
