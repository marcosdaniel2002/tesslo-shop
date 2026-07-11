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
        surface: "var(--surface)",
        foreground: "var(--foreground)",
        secondary: "var(--text-secondary)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        border: "var(--border)",
        divider: "var(--divider)",
        danger: "var(--danger)",
        dangerText: "var(--danger-text)",
        warning: "var(--warning)",
      },
      borderRadius: {
        notion: "14px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
