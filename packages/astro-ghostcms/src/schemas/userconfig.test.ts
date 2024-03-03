import { expect, describe, it } from "vitest";
import { GhostUserConfigSchema } from "./userconfig";

describe("GhostUserConfigSchema", () => {
  it("should validate a valid user config", () => {
    const validConfig = {
      ghostURL: "https://ghostdemo.matthiesen.xyz",
      disableThemeProvider: true,
      ThemeProvider: {
        theme: "@matthiesenxyz/astro-ghostcms-theme-default",
      },
      disableDefault404: false,
      enableRSSFeed: true,
      enableOGImages: true,
      sitemap: {
        // sitemap configuration
      },
      robotstxt: {
        // robotstxt configuration
      },
      fullConsoleLogs: false,
    };

    const result = GhostUserConfigSchema.safeParse(validConfig);

    expect(result.success).to.be.true;
    expect(result.data).to.deep.equal(validConfig);
  });

  it("should invalidate an invalid user config", () => {
    const invalidConfig = {
      ghostURL: "invalid-url",
      disableThemeProvider: "true",
      ThemeProvider: {
        theme: 123,
      },
      disableDefault404: "false",
      enableRSSFeed: "true",
      enableOGImages: "true",
      sitemap: {
        // invalid sitemap configuration
      },
      robotstxt: {
        // invalid robotstxt configuration
      },
      fullConsoleLogs: "false",
    };

    const result = GhostUserConfigSchema.safeParse(invalidConfig);

    expect(result.success).to.be.false;
    expect(!result.success).to.exist;
  });
});