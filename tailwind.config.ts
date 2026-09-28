import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#12263A", teal: { DEFAULT: "#0F766E", soft: "#E3F2F0" }, brass: "#B7791F" } } },
  plugins: [],
} satisfies Config;
