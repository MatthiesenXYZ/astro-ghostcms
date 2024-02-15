/** @type {import('tailwindcss').Config} */
import { fontFamily as _fontFamily } from "tailwindcss/defaultTheme";
export const content = [
	"./node_modules/@matthiesenxyz/astro-ghostcms-catppuccin/src/**/*.{astro,js,css,ts}",
];
export const theme = {
	extend: {
		fontFamily: {
			sans: ["Inter Variable", "Inter", ..._fontFamily.sans],
		},
	},
};
export const plugins = [
	require("@tailwindcss/typography"),
	require("@catppuccin/tailwindcss")({
		prefix: "ctp",
		defaultFlavour: "mocha",
	}),
];
