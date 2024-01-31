/** @type {import('tailwindcss').Config} */
import { fontFamily as _fontFamily } from "tailwindcss/defaultTheme";
export const content = ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"];
export const theme = {
  extend: {
    fontFamily: {
      sans: ["Inter Variable", "Inter", ..._fontFamily.sans],
    },
  },
};
export const plugins = [
  require("@tailwindcss/typography"),
  require("@catppuccin/tailwindcss")({ prefix: 'ctp', defaultFlavour: "macchiato" })
];
