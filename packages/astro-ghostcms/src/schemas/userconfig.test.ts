import { describe, expect, it } from "vitest";
import { GhostUserConfigSchema } from "./userconfig";

describe("GhostUserConfigSchema", () => {
	it("should validate a valid user config", () => {
		const validConfig = {
			ghostURL: "https://ghostdemo.matthiesen.xyz",
			ThemeProvider: {
				disableThemeProvider: true,
				theme: "@matthiesenxyz/astro-ghostcms-theme-default",
			},
			disableDefault404: false,
			enableRSSFeed: true,
			enableOGImages: true,
			verbose: false,
		};

		const result = GhostUserConfigSchema.safeParse(validConfig);

		expect(result.success).to.be.true;
		// @ts-expect-error
		expect(result.data).to.deep.equal(validConfig);
	});

	it("should invalidate an invalid user config", () => {
		const invalidConfig = {
			ghostURL: "invalid-url",
			ThemeProvider: {
				disableThemeProvider: "true",
				theme: 123,
			},
			disableDefault404: "false",
			enableRSSFeed: "true",
			enableOGImages: "true",
			Integrations: {
				sitemap: {
					// invalid sitemap configuration
				},
				robotstxt: {
					// invalid robotstxt configuration
				},
			},
			verbose: "false",
		};

		const result = GhostUserConfigSchema.safeParse(invalidConfig);

		expect(result.success).to.be.false;
		expect(!result.success).to.exist;
	});
});
