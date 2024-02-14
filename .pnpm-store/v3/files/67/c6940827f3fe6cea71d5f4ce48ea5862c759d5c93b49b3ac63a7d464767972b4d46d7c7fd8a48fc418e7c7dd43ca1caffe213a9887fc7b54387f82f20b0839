import { bundledLanguages, createCssVariablesTheme, getHighlighter } from "shikiji";
import { visit } from "unist-util-visit";
const ASTRO_COLOR_REPLACEMENTS = {
  "--astro-code-foreground": "--astro-code-color-text",
  "--astro-code-background": "--astro-code-color-background"
};
const COLOR_REPLACEMENT_REGEX = new RegExp(
  `(${Object.keys(ASTRO_COLOR_REPLACEMENTS).join("|")})`,
  "g"
);
let _cssVariablesTheme;
const cssVariablesTheme = () => _cssVariablesTheme ?? (_cssVariablesTheme = createCssVariablesTheme({ variablePrefix: "--astro-code-" }));
async function createShikiHighlighter({
  langs = [],
  theme = "github-dark",
  experimentalThemes = {},
  wrap = false,
  transformers = []
} = {}) {
  const themes = experimentalThemes;
  theme = theme === "css-variables" ? cssVariablesTheme() : theme;
  const highlighter = await getHighlighter({
    langs: langs.length ? langs : Object.keys(bundledLanguages),
    themes: Object.values(themes).length ? Object.values(themes) : [theme]
  });
  const loadedLanguages = highlighter.getLoadedLanguages();
  return {
    highlight(code, lang = "plaintext", options) {
      if (lang !== "plaintext" && !loadedLanguages.includes(lang)) {
        console.warn(`[Shiki] The language "${lang}" doesn't exist, falling back to "plaintext".`);
        lang = "plaintext";
      }
      const themeOptions = Object.values(themes).length ? { themes } : { theme };
      const inline = options?.inline ?? false;
      return highlighter.codeToHtml(code, {
        ...themeOptions,
        lang,
        transformers: [
          {
            pre(node) {
              if (inline) {
                node.tagName = "code";
              }
              const classValue = normalizePropAsString(node.properties.class) ?? "";
              const styleValue = normalizePropAsString(node.properties.style) ?? "";
              node.properties.class = classValue.replace(/shiki/g, "astro-code");
              if (wrap === false) {
                node.properties.style = styleValue + "; overflow-x: auto;";
              } else if (wrap === true) {
                node.properties.style = styleValue + "; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;";
              }
            },
            line(node) {
              if (lang === "diff") {
                const innerSpanNode = node.children[0];
                const innerSpanTextNode = innerSpanNode?.type === "element" && innerSpanNode.children?.[0];
                if (innerSpanTextNode && innerSpanTextNode.type === "text") {
                  const start = innerSpanTextNode.value[0];
                  if (start === "+" || start === "-") {
                    innerSpanTextNode.value = innerSpanTextNode.value.slice(1);
                    innerSpanNode.children.unshift({
                      type: "element",
                      tagName: "span",
                      properties: { style: "user-select: none;" },
                      children: [{ type: "text", value: start }]
                    });
                  }
                }
              }
            },
            code(node) {
              if (inline) {
                return node.children[0];
              }
            },
            root(node) {
              if (Object.values(experimentalThemes).length) {
                return;
              }
              const themeName = typeof theme === "string" ? theme : theme.name;
              if (themeName === "css-variables") {
                visit(node, "element", (child) => {
                  if (child.properties?.style) {
                    child.properties.style = replaceCssVariables(child.properties.style);
                  }
                });
              }
            }
          },
          ...transformers
        ]
      });
    }
  };
}
function normalizePropAsString(value) {
  return Array.isArray(value) ? value.join(" ") : value;
}
function replaceCssVariables(str) {
  return str.replace(COLOR_REPLACEMENT_REGEX, (match) => ASTRO_COLOR_REPLACEMENTS[match] || match);
}
export {
  createShikiHighlighter,
  replaceCssVariables
};
