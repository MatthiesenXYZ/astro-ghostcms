'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@unocss/core');
const extractorArbitraryVariants = require('@unocss/extractor-arbitrary-variants');
const utils = require('./shared/preset-mini.ImRm63ih.cjs');
const theme = require('./theme.cjs');
const rules = require('./rules.cjs');
const variants = require('./variants.cjs');
const colors = require('./colors.cjs');
require('@unocss/rule-utils');
require('./shared/preset-mini.MACvs-wn.cjs');

const preflights = [
  {
    layer: "preflights",
    getCSS(ctx) {
      if (ctx.theme.preflightBase) {
        const css = core.entriesToCss(Object.entries(ctx.theme.preflightBase));
        const roots = core.toArray(ctx.theme.preflightRoot ?? ["*,::before,::after", "::backdrop"]);
        return roots.map((root) => `${root}{${css}}`).join("");
      }
    }
  }
];

const shorthands = {
  position: [
    "relative",
    "absolute",
    "fixed",
    "sticky",
    "static"
  ],
  globalKeyword: utils.globalKeywords
};

const presetMini = core.definePreset((options = {}) => {
  options.dark = options.dark ?? "class";
  options.attributifyPseudo = options.attributifyPseudo ?? false;
  options.preflight = options.preflight ?? true;
  options.variablePrefix = options.variablePrefix ?? "un-";
  return {
    name: "@unocss/preset-mini",
    theme: theme.theme,
    rules: rules.rules,
    variants: variants.variants(options),
    options,
    prefix: options.prefix,
    postprocess: VarPrefixPostprocessor(options.variablePrefix),
    preflights: options.preflight ? normalizePreflights(preflights, options.variablePrefix) : [],
    extractorDefault: options.arbitraryVariants === false ? void 0 : extractorArbitraryVariants.extractorArbitraryVariants,
    autocomplete: {
      shorthands
    }
  };
});
function VarPrefixPostprocessor(prefix) {
  if (prefix !== "un-") {
    return (obj) => {
      obj.entries.forEach((i) => {
        i[0] = i[0].replace(/^--un-/, `--${prefix}`);
        if (typeof i[1] === "string")
          i[1] = i[1].replace(/var\(--un-/g, `var(--${prefix}`);
      });
    };
  }
}
function normalizePreflights(preflights3, variablePrefix) {
  if (variablePrefix !== "un-") {
    return preflights3.map((p) => ({
      ...p,
      getCSS: (() => async (ctx) => {
        const css = await p.getCSS(ctx);
        if (css)
          return css.replace(/--un-/g, `--${variablePrefix}`);
      })()
    }));
  }
  return preflights3;
}

exports.parseColor = utils.parseColor;
exports.theme = theme.theme;
exports.colors = colors.colors;
exports.VarPrefixPostprocessor = VarPrefixPostprocessor;
exports.default = presetMini;
exports.normalizePreflights = normalizePreflights;
exports.preflights = preflights;
exports.presetMini = presetMini;
