'use strict';

const utils = require('./shared/preset-mini.ImRm63ih.cjs');
const ruleUtils = require('@unocss/rule-utils');
const core = require('@unocss/core');
const transform = require('./shared/preset-mini.MACvs-wn.cjs');

const verticalAlignAlias = {
  "mid": "middle",
  "base": "baseline",
  "btm": "bottom",
  "baseline": "baseline",
  "top": "top",
  "start": "top",
  "middle": "middle",
  "bottom": "bottom",
  "end": "bottom",
  "text-top": "text-top",
  "text-bottom": "text-bottom",
  "sub": "sub",
  "super": "super",
  ...Object.fromEntries(utils.globalKeywords.map((x) => [x, x]))
};
const verticalAligns = [
  [
    /^(?:vertical|align|v)-([-\w]+%?)$/,
    ([, v]) => ({ "vertical-align": verticalAlignAlias[v] ?? utils.h.numberWithUnit(v) }),
    {
      autocomplete: [
        `(vertical|align|v)-(${Object.keys(verticalAlignAlias).join("|")})`,
        "(vertical|align|v)-<percentage>"
      ]
    }
  ]
];
const textAligns = ["center", "left", "right", "justify", "start", "end"].map((v) => [`text-${v}`, { "text-align": v }]);

const outline = [
  // size
  [/^outline-(?:width-|size-)?(.+)$/, ([, d], { theme }) => ({ "outline-width": theme.lineWidth?.[d] ?? utils.h.bracket.cssvar.global.px(d) }), { autocomplete: "outline-(width|size)-<num>" }],
  // color
  [/^outline-(?:color-)?(.+)$/, utils.colorResolver("outline-color", "outline-color", "borderColor"), { autocomplete: "outline-$colors" }],
  // offset
  [/^outline-offset-(.+)$/, ([, d], { theme }) => ({ "outline-offset": theme.lineWidth?.[d] ?? utils.h.bracket.cssvar.global.px(d) }), { autocomplete: "outline-(offset)-<num>" }],
  // style
  ["outline", { "outline-style": "solid" }],
  ...["auto", "dashed", "dotted", "double", "hidden", "solid", "groove", "ridge", "inset", "outset", ...utils.globalKeywords].map((v) => [`outline-${v}`, { "outline-style": v }]),
  ["outline-none", { "outline": "2px solid transparent", "outline-offset": "2px" }]
];
const appearance = [
  ["appearance-none", {
    "-webkit-appearance": "none",
    "appearance": "none"
  }]
];
function willChangeProperty(prop) {
  return utils.h.properties.auto.global(prop) ?? {
    contents: "contents",
    scroll: "scroll-position"
  }[prop];
}
const willChange = [
  [/^will-change-(.+)/, ([, p]) => ({ "will-change": willChangeProperty(p) })]
];

const borderStyles = ["solid", "dashed", "dotted", "double", "hidden", "none", "groove", "ridge", "inset", "outset", ...utils.globalKeywords];
const borders = [
  // compound
  [/^(?:border|b)()(?:-(.+))?$/, handlerBorder, { autocomplete: "(border|b)-<directions>" }],
  [/^(?:border|b)-([xy])(?:-(.+))?$/, handlerBorder],
  [/^(?:border|b)-([rltbse])(?:-(.+))?$/, handlerBorder],
  [/^(?:border|b)-(block|inline)(?:-(.+))?$/, handlerBorder],
  [/^(?:border|b)-([bi][se])(?:-(.+))?$/, handlerBorder],
  // size
  [/^(?:border|b)-()(?:width|size)-(.+)$/, handlerBorderSize, { autocomplete: ["(border|b)-<num>", "(border|b)-<directions>-<num>"] }],
  [/^(?:border|b)-([xy])-(?:width|size)-(.+)$/, handlerBorderSize],
  [/^(?:border|b)-([rltbse])-(?:width|size)-(.+)$/, handlerBorderSize],
  [/^(?:border|b)-(block|inline)-(?:width|size)-(.+)$/, handlerBorderSize],
  [/^(?:border|b)-([bi][se])-(?:width|size)-(.+)$/, handlerBorderSize],
  // colors
  [/^(?:border|b)-()(?:color-)?(.+)$/, handlerBorderColor, { autocomplete: ["(border|b)-$colors", "(border|b)-<directions>-$colors"] }],
  [/^(?:border|b)-([xy])-(?:color-)?(.+)$/, handlerBorderColor],
  [/^(?:border|b)-([rltbse])-(?:color-)?(.+)$/, handlerBorderColor],
  [/^(?:border|b)-(block|inline)-(?:color-)?(.+)$/, handlerBorderColor],
  [/^(?:border|b)-([bi][se])-(?:color-)?(.+)$/, handlerBorderColor],
  // opacity
  [/^(?:border|b)-()op(?:acity)?-?(.+)$/, handlerBorderOpacity, { autocomplete: "(border|b)-(op|opacity)-<percent>" }],
  [/^(?:border|b)-([xy])-op(?:acity)?-?(.+)$/, handlerBorderOpacity],
  [/^(?:border|b)-([rltbse])-op(?:acity)?-?(.+)$/, handlerBorderOpacity],
  [/^(?:border|b)-(block|inline)-op(?:acity)?-?(.+)$/, handlerBorderOpacity],
  [/^(?:border|b)-([bi][se])-op(?:acity)?-?(.+)$/, handlerBorderOpacity],
  // radius
  [/^(?:border-|b-)?(?:rounded|rd)()(?:-(.+))?$/, handlerRounded, { autocomplete: ["(border|b)-(rounded|rd)", "(border|b)-(rounded|rd)-<num>", "(rounded|rd)", "(rounded|rd)-<num>"] }],
  [/^(?:border-|b-)?(?:rounded|rd)-([rltbse])(?:-(.+))?$/, handlerRounded],
  [/^(?:border-|b-)?(?:rounded|rd)-([rltb]{2})(?:-(.+))?$/, handlerRounded],
  [/^(?:border-|b-)?(?:rounded|rd)-([bise][se])(?:-(.+))?$/, handlerRounded],
  [/^(?:border-|b-)?(?:rounded|rd)-([bi][se]-[bi][se])(?:-(.+))?$/, handlerRounded],
  // style
  [/^(?:border|b)-(?:style-)?()(.+)$/, handlerBorderStyle, { autocomplete: ["(border|b)-style", `(border|b)-(${borderStyles.join("|")})`, "(border|b)-<directions>-style", `(border|b)-<directions>-(${borderStyles.join("|")})`, `(border|b)-<directions>-style-(${borderStyles.join("|")})`, `(border|b)-style-(${borderStyles.join("|")})`] }],
  [/^(?:border|b)-([xy])-(?:style-)?(.+)$/, handlerBorderStyle],
  [/^(?:border|b)-([rltbse])-(?:style-)?(.+)$/, handlerBorderStyle],
  [/^(?:border|b)-(block|inline)-(?:style-)?(.+)$/, handlerBorderStyle],
  [/^(?:border|b)-([bi][se])-(?:style-)?(.+)$/, handlerBorderStyle]
];
function borderColorResolver(direction) {
  return ([, body], theme) => {
    const data = utils.parseColor(body, theme, "borderColor");
    if (!data)
      return;
    const { alpha, color, cssColor } = data;
    if (cssColor) {
      if (alpha != null) {
        return {
          [`border${direction}-color`]: ruleUtils.colorToString(cssColor, alpha)
        };
      }
      if (direction === "") {
        return {
          "--un-border-opacity": ruleUtils.colorOpacityToString(cssColor),
          "border-color": ruleUtils.colorToString(cssColor, "var(--un-border-opacity)")
        };
      } else {
        return {
          // Separate this return since if `direction` is an empty string, the first key will be overwritten by the second.
          "--un-border-opacity": ruleUtils.colorOpacityToString(cssColor),
          [`--un-border${direction}-opacity`]: "var(--un-border-opacity)",
          [`border${direction}-color`]: ruleUtils.colorToString(cssColor, `var(--un-border${direction}-opacity)`)
        };
      }
    } else if (color) {
      if (utils.isCSSMathFn(color)) {
        return {
          "border-width": color
        };
      }
      return {
        [`border${direction}-color`]: ruleUtils.colorToString(color, alpha)
      };
    }
  };
}
function handlerBorder(m, ctx) {
  return handlerBorderSize(m, ctx);
}
function handlerBorderSize([, a = "", b], { theme }) {
  const v = theme.lineWidth?.[b || "DEFAULT"] ?? utils.h.bracket.cssvar.global.px(b || "1");
  if (a in utils.directionMap && v != null)
    return utils.directionMap[a].map((i) => [`border${i}-width`, v]);
}
function handlerBorderColor([, a = "", c], { theme }) {
  if (a in utils.directionMap && utils.hasParseableColor(c, theme, "borderColor")) {
    return Object.assign(
      {},
      ...utils.directionMap[a].map((i) => borderColorResolver(i)(["", c], theme))
    );
  }
}
function handlerBorderOpacity([, a = "", opacity]) {
  const v = utils.h.bracket.percent.cssvar(opacity);
  if (a in utils.directionMap && v != null)
    return utils.directionMap[a].map((i) => [`--un-border${i}-opacity`, v]);
}
function handlerRounded([, a = "", s], { theme }) {
  const v = theme.borderRadius?.[s || "DEFAULT"] || utils.h.bracket.cssvar.global.fraction.rem(s || "1");
  if (a in utils.cornerMap && v != null)
    return utils.cornerMap[a].map((i) => [`border${i}-radius`, v]);
}
function handlerBorderStyle([, a = "", s]) {
  if (borderStyles.includes(s) && a in utils.directionMap)
    return utils.directionMap[a].map((i) => [`border${i}-style`, s]);
}

const opacity = [
  [/^op(?:acity)?-?(.+)$/, ([, d]) => ({ opacity: utils.h.bracket.percent.cssvar(d) })]
];
const textColors = [
  [/^(?:color|c)-(.+)$/, utils.colorResolver("color", "text", "textColor"), { autocomplete: "(color|c)-$colors" }],
  // auto detection and fallback to font-size if the content looks like a size
  [/^text-(.+)$/, utils.colorResolver("color", "text", "textColor", (css) => !css.color?.toString().match(utils.numberWithUnitRE)), { autocomplete: "text-$colors" }],
  [/^(?:text|color|c)-(.+)$/, ([, v]) => utils.globalKeywords.includes(v) ? { color: v } : void 0, { autocomplete: `(text|color|c)-(${utils.globalKeywords.join("|")})` }],
  [/^(?:text|color|c)-op(?:acity)?-?(.+)$/, ([, opacity2]) => ({ "--un-text-opacity": utils.h.bracket.percent.cssvar(opacity2) }), { autocomplete: "(text|color|c)-(op|opacity)-<percent>" }]
];
const bgColors = [
  [/^bg-(.+)$/, (...args) => utils.isSize(args[0][1]) ? void 0 : utils.colorResolver("background-color", "bg", "backgroundColor")(...args), { autocomplete: "bg-$colors" }],
  [/^bg-op(?:acity)?-?(.+)$/, ([, opacity2]) => ({ "--un-bg-opacity": utils.h.bracket.percent.cssvar(opacity2) }), { autocomplete: "bg-(op|opacity)-<percent>" }]
];
const colorScheme = [
  [/^color-scheme-(\w+)$/, ([, v]) => ({ "color-scheme": v })]
];

const containerParent = [
  [/^@container(?:\/(\w+))?(?:-(normal))?$/, ([, l, v]) => {
    core.warnOnce("The container query rule is experimental and may not follow semver.");
    return {
      "container-type": v ?? "inline-size",
      "container-name": l
    };
  }]
];

const decorationStyles = ["solid", "double", "dotted", "dashed", "wavy", ...utils.globalKeywords];
const textDecorations = [
  [/^(?:decoration-)?(underline|overline|line-through)$/, ([, s]) => ({ "text-decoration-line": s }), { autocomplete: "decoration-(underline|overline|line-through)" }],
  // size
  [/^(?:underline|decoration)-(?:size-)?(.+)$/, ([, s], { theme }) => ({ "text-decoration-thickness": theme.lineWidth?.[s] ?? utils.h.bracket.cssvar.global.px(s) }), { autocomplete: "(underline|decoration)-<num>" }],
  [/^(?:underline|decoration)-(auto|from-font)$/, ([, s]) => ({ "text-decoration-thickness": s }), { autocomplete: "(underline|decoration)-(auto|from-font)" }],
  // colors
  [/^(?:underline|decoration)-(.+)$/, (match, ctx) => {
    const result = utils.colorResolver("text-decoration-color", "line", "borderColor")(match, ctx);
    if (result) {
      return {
        "-webkit-text-decoration-color": result["text-decoration-color"],
        ...result
      };
    }
  }, { autocomplete: "(underline|decoration)-$colors" }],
  [/^(?:underline|decoration)-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ "--un-line-opacity": utils.h.bracket.percent.cssvar(opacity) }), { autocomplete: "(underline|decoration)-(op|opacity)-<percent>" }],
  // offset
  [/^(?:underline|decoration)-offset-(.+)$/, ([, s], { theme }) => ({ "text-underline-offset": theme.lineWidth?.[s] ?? utils.h.auto.bracket.cssvar.global.px(s) }), { autocomplete: "(underline|decoration)-(offset)-<num>" }],
  // style
  ...decorationStyles.map((v) => [`underline-${v}`, { "text-decoration-style": v }]),
  ...decorationStyles.map((v) => [`decoration-${v}`, { "text-decoration-style": v }]),
  ["no-underline", { "text-decoration": "none" }],
  ["decoration-none", { "text-decoration": "none" }]
];

const transitionPropertyGroup = {
  all: "all",
  colors: ["color", "background-color", "border-color", "outline-color", "text-decoration-color", "fill", "stroke"].join(","),
  none: "none",
  opacity: "opacity",
  shadow: "box-shadow",
  transform: "transform"
};
function transitionProperty(prop) {
  return utils.h.properties(prop) ?? transitionPropertyGroup[prop];
}
const transitions = [
  // transition
  [
    /^transition(?:-([a-z-]+(?:,[a-z-]+)*))?(?:-(\d+))?$/,
    ([, prop, d], { theme }) => {
      const p = prop != null ? transitionProperty(prop) : [transitionPropertyGroup.colors, "opacity", "box-shadow", "transform", "filter", "backdrop-filter"].join(",");
      if (p) {
        const duration = theme.duration?.[d || "DEFAULT"] ?? utils.h.time(d || "150");
        return {
          "transition-property": p,
          "transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
          "transition-duration": duration
        };
      }
    },
    { autocomplete: `transition-(${Object.keys(transitionPropertyGroup).join("|")})` }
  ],
  // timings
  [
    /^(?:transition-)?duration-(.+)$/,
    ([, d], { theme }) => ({ "transition-duration": theme.duration?.[d || "DEFAULT"] ?? utils.h.bracket.cssvar.time(d) }),
    { autocomplete: ["transition-duration-$duration", "duration-$duration"] }
  ],
  [
    /^(?:transition-)?delay-(.+)$/,
    ([, d], { theme }) => ({ "transition-delay": theme.duration?.[d || "DEFAULT"] ?? utils.h.bracket.cssvar.time(d) }),
    { autocomplete: ["transition-delay-$duration", "delay-$duration"] }
  ],
  [
    /^(?:transition-)?ease(?:-(.+))?$/,
    ([, d], { theme }) => ({ "transition-timing-function": theme.easing?.[d || "DEFAULT"] ?? utils.h.bracket.cssvar(d) }),
    { autocomplete: ["transition-ease-(linear|in|out|in-out|DEFAULT)", "ease-(linear|in|out|in-out|DEFAULT)"] }
  ],
  // props
  [
    /^(?:transition-)?property-(.+)$/,
    ([, v]) => ({ "transition-property": utils.h.bracket.global(v) || transitionProperty(v) }),
    { autocomplete: [`transition-property-(${[...utils.globalKeywords, ...Object.keys(transitionPropertyGroup)].join("|")})`] }
  ],
  // none
  ["transition-none", { transition: "none" }],
  ...utils.makeGlobalStaticRules("transition")
];

const flex = [
  // display
  ["flex", { display: "flex" }],
  ["inline-flex", { display: "inline-flex" }],
  ["flex-inline", { display: "inline-flex" }],
  // flex
  [/^flex-(.*)$/, ([, d]) => ({ flex: utils.h.bracket(d) != null ? utils.h.bracket(d).split(" ").map((e) => utils.h.cssvar.fraction(e) ?? e).join(" ") : utils.h.cssvar.fraction(d) })],
  ["flex-1", { flex: "1 1 0%" }],
  ["flex-auto", { flex: "1 1 auto" }],
  ["flex-initial", { flex: "0 1 auto" }],
  ["flex-none", { flex: "none" }],
  // shrink/grow/basis
  [/^(?:flex-)?shrink(?:-(.*))?$/, ([, d = ""]) => ({ "flex-shrink": utils.h.bracket.cssvar.number(d) ?? 1 }), { autocomplete: ["flex-shrink-<num>", "shrink-<num>"] }],
  [/^(?:flex-)?grow(?:-(.*))?$/, ([, d = ""]) => ({ "flex-grow": utils.h.bracket.cssvar.number(d) ?? 1 }), { autocomplete: ["flex-grow-<num>", "grow-<num>"] }],
  [/^(?:flex-)?basis-(.+)$/, ([, d], { theme }) => ({ "flex-basis": theme.spacing?.[d] ?? utils.h.bracket.cssvar.auto.fraction.rem(d) }), { autocomplete: ["flex-basis-$spacing", "basis-$spacing"] }],
  // directions
  ["flex-row", { "flex-direction": "row" }],
  ["flex-row-reverse", { "flex-direction": "row-reverse" }],
  ["flex-col", { "flex-direction": "column" }],
  ["flex-col-reverse", { "flex-direction": "column-reverse" }],
  // wraps
  ["flex-wrap", { "flex-wrap": "wrap" }],
  ["flex-wrap-reverse", { "flex-wrap": "wrap-reverse" }],
  ["flex-nowrap", { "flex-wrap": "nowrap" }]
];

function handleThemeByKey(s, theme, key) {
  return theme[key]?.[s] || utils.h.bracket.cssvar.global.rem(s);
}
const fonts = [
  // size
  [
    /^text-(.+)$/,
    ([, s = "base"], { theme }) => {
      const [size, leading] = utils.splitShorthand(s, "length");
      const sizePairs = core.toArray(theme.fontSize?.[size]);
      const lineHeight = leading ? handleThemeByKey(leading, theme, "lineHeight") : void 0;
      if (sizePairs?.[0]) {
        const [fontSize2, height, letterSpacing] = sizePairs;
        if (typeof height === "object") {
          return {
            "font-size": fontSize2,
            ...height
          };
        }
        return {
          "font-size": fontSize2,
          "line-height": lineHeight ?? height ?? "1",
          "letter-spacing": letterSpacing ? handleThemeByKey(letterSpacing, theme, "letterSpacing") : void 0
        };
      }
      const fontSize = utils.h.bracketOfLength.rem(size);
      if (lineHeight && fontSize) {
        return {
          "font-size": fontSize,
          "line-height": lineHeight
        };
      }
      return { "font-size": utils.h.bracketOfLength.rem(s) };
    },
    { autocomplete: "text-$fontSize" }
  ],
  [/^(?:text|font)-size-(.+)$/, ([, s], { theme }) => {
    const themed = core.toArray(theme.fontSize?.[s]);
    const size = themed?.[0] ?? utils.h.bracket.cssvar.global.rem(s);
    if (size != null)
      return { "font-size": size };
  }, { autocomplete: "text-size-$fontSize" }],
  // weights
  [
    /^(?:font|fw)-?([^-]+)$/,
    ([, s], { theme }) => ({ "font-weight": theme.fontWeight?.[s] || utils.h.bracket.global.number(s) }),
    {
      autocomplete: [
        "(font|fw)-(100|200|300|400|500|600|700|800|900)",
        "(font|fw)-$fontWeight"
      ]
    }
  ],
  // leadings
  [
    /^(?:font-)?(?:leading|lh|line-height)-(.+)$/,
    ([, s], { theme }) => ({ "line-height": handleThemeByKey(s, theme, "lineHeight") }),
    { autocomplete: "(leading|lh|line-height)-$lineHeight" }
  ],
  // synthesis
  ["font-synthesis-weight", { "font-synthesis": "weight" }],
  ["font-synthesis-style", { "font-synthesis": "style" }],
  ["font-synthesis-small-caps", { "font-synthesis": "small-caps" }],
  ["font-synthesis-none", { "font-synthesis": "none" }],
  [/^font-synthesis-(.+)$/, ([, s]) => ({ "font-synthesis": utils.h.bracket.cssvar.global(s) })],
  // tracking
  [
    /^(?:font-)?tracking-(.+)$/,
    ([, s], { theme }) => ({ "letter-spacing": theme.letterSpacing?.[s] || utils.h.bracket.cssvar.global.rem(s) }),
    { autocomplete: "tracking-$letterSpacing" }
  ],
  // word-spacing
  [
    /^(?:font-)?word-spacing-(.+)$/,
    ([, s], { theme }) => ({ "word-spacing": theme.wordSpacing?.[s] || utils.h.bracket.cssvar.global.rem(s) }),
    { autocomplete: "word-spacing-$wordSpacing" }
  ],
  // family
  [
    /^font-(.+)$/,
    ([, d], { theme }) => ({ "font-family": theme.fontFamily?.[d] || utils.h.bracket.cssvar.global(d) }),
    { autocomplete: "font-$fontFamily" }
  ]
];
const tabSizes = [
  [/^tab(?:-(.+))?$/, ([, s]) => {
    const v = utils.h.bracket.cssvar.global.number(s || "4");
    if (v != null) {
      return {
        "-moz-tab-size": v,
        "-o-tab-size": v,
        "tab-size": v
      };
    }
  }]
];
const textIndents = [
  [/^indent(?:-(.+))?$/, ([, s], { theme }) => ({ "text-indent": theme.textIndent?.[s || "DEFAULT"] || utils.h.bracket.cssvar.global.fraction.rem(s) }), { autocomplete: "indent-$textIndent" }]
];
const textStrokes = [
  // widths
  [/^text-stroke(?:-(.+))?$/, ([, s], { theme }) => ({ "-webkit-text-stroke-width": theme.textStrokeWidth?.[s || "DEFAULT"] || utils.h.bracket.cssvar.px(s) }), { autocomplete: "text-stroke-$textStrokeWidth" }],
  // colors
  [/^text-stroke-(.+)$/, utils.colorResolver("-webkit-text-stroke-color", "text-stroke", "borderColor"), { autocomplete: "text-stroke-$colors" }],
  [/^text-stroke-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ "--un-text-stroke-opacity": utils.h.bracket.percent.cssvar(opacity) }), { autocomplete: "text-stroke-(op|opacity)-<percent>" }]
];
const textShadows = [
  [/^text-shadow(?:-(.+))?$/, ([, s], { theme }) => {
    const v = theme.textShadow?.[s || "DEFAULT"];
    if (v != null) {
      return {
        "--un-text-shadow": utils.colorableShadows(v, "--un-text-shadow-color").join(","),
        "text-shadow": "var(--un-text-shadow)"
      };
    }
    return { "text-shadow": utils.h.bracket.cssvar.global(s) };
  }, { autocomplete: "text-shadow-$textShadow" }],
  // colors
  [/^text-shadow-color-(.+)$/, utils.colorResolver("--un-text-shadow-color", "text-shadow", "shadowColor"), { autocomplete: "text-shadow-color-$colors" }],
  [/^text-shadow-color-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ "--un-text-shadow-opacity": utils.h.bracket.percent.cssvar(opacity) }), { autocomplete: "text-shadow-color-(op|opacity)-<percent>" }]
];

const directions = {
  "": "",
  "x": "column-",
  "y": "row-"
};
function handleGap([, d = "", s], { theme }) {
  const v = theme.spacing?.[s] ?? utils.h.bracket.cssvar.global.rem(s);
  if (v != null) {
    return {
      [`${directions[d]}gap`]: v
    };
  }
}
const gaps = [
  [/^(?:flex-|grid-)?gap-?()(.+)$/, handleGap, { autocomplete: ["gap-$spacing", "gap-<num>"] }],
  [/^(?:flex-|grid-)?gap-([xy])-?(.+)$/, handleGap, { autocomplete: ["gap-(x|y)-$spacing", "gap-(x|y)-<num>"] }]
];

function rowCol(s) {
  return s.replace("col", "column");
}
function rowColTheme(s) {
  return s[0] === "r" ? "Row" : "Column";
}
function autoDirection(c, theme, prop) {
  const v = theme[`gridAuto${rowColTheme(c)}`]?.[prop];
  if (v != null)
    return v;
  switch (prop) {
    case "min":
      return "min-content";
    case "max":
      return "max-content";
    case "fr":
      return "minmax(0,1fr)";
  }
  return utils.h.bracket.cssvar.auto.rem(prop);
}
const grids = [
  // displays
  ["grid", { display: "grid" }],
  ["inline-grid", { display: "inline-grid" }],
  // global
  [/^(?:grid-)?(row|col)-(.+)$/, ([, c, v], { theme }) => ({
    [`grid-${rowCol(c)}`]: theme[`grid${rowColTheme(c)}`]?.[v] ?? utils.h.bracket.cssvar.auto(v)
  })],
  // span
  [/^(?:grid-)?(row|col)-span-(.+)$/, ([, c, s]) => {
    if (s === "full")
      return { [`grid-${rowCol(c)}`]: "1/-1" };
    const v = utils.h.bracket.number(s);
    if (v != null)
      return { [`grid-${rowCol(c)}`]: `span ${v}/span ${v}` };
  }, { autocomplete: ["grid-(row|col)-span-<num>", "(row|col)-span-<num>"] }],
  // starts & ends
  [/^(?:grid-)?(row|col)-start-(.+)$/, ([, c, v]) => ({ [`grid-${rowCol(c)}-start`]: utils.h.bracket.cssvar(v) ?? v })],
  [/^(?:grid-)?(row|col)-end-(.+)$/, ([, c, v]) => ({ [`grid-${rowCol(c)}-end`]: utils.h.bracket.cssvar(v) ?? v }), { autocomplete: ["grid-(row|col)-(start|end)-<num>"] }],
  // auto flows
  [/^(?:grid-)?auto-(rows|cols)-(.+)$/, ([, c, v], { theme }) => ({ [`grid-auto-${rowCol(c)}`]: autoDirection(c, theme, v) }), { autocomplete: ["grid-auto-(rows|cols)-<num>"] }],
  // grid-auto-flow, auto-flow: uno
  // grid-flow: wind
  [/^(?:grid-auto-flow|auto-flow|grid-flow)-(.+)$/, ([, v]) => ({ "grid-auto-flow": utils.h.bracket.cssvar(v) })],
  [/^(?:grid-auto-flow|auto-flow|grid-flow)-(row|col|dense|row-dense|col-dense)$/, ([, v]) => ({ "grid-auto-flow": rowCol(v).replace("-", " ") }), { autocomplete: ["(grid-auto-flow|auto-flow|grid-flow)-(row|col|dense|row-dense|col-dense)"] }],
  // templates
  [/^grid-(rows|cols)-(.+)$/, ([, c, v], { theme }) => ({
    [`grid-template-${rowCol(c)}`]: theme[`gridTemplate${rowColTheme(c)}`]?.[v] ?? utils.h.bracket.cssvar(v)
  })],
  [/^grid-(rows|cols)-minmax-([\w.-]+)$/, ([, c, d]) => ({ [`grid-template-${rowCol(c)}`]: `repeat(auto-fill,minmax(${d},1fr))` })],
  [/^grid-(rows|cols)-(\d+)$/, ([, c, d]) => ({ [`grid-template-${rowCol(c)}`]: `repeat(${d},minmax(0,1fr))` }), { autocomplete: ["grid-(rows|cols)-<num>", "grid-(rows|cols)-none"] }],
  // areas
  [/^grid-area(s)?-(.+)$/, ([, s, v]) => {
    if (s != null)
      return { "grid-template-areas": utils.h.cssvar(v) ?? v.split("-").map((s2) => `"${utils.h.bracket(s2)}"`).join(" ") };
    return { "grid-area": utils.h.bracket.cssvar(v) };
  }],
  // template none
  ["grid-rows-none", { "grid-template-rows": "none" }],
  ["grid-cols-none", { "grid-template-columns": "none" }],
  // template subgrid
  ["grid-rows-subgrid", { "grid-template-rows": "subgrid" }],
  ["grid-cols-subgrid", { "grid-template-columns": "subgrid" }]
];

const overflowValues = [
  "auto",
  "hidden",
  "clip",
  "visible",
  "scroll",
  "overlay",
  ...utils.globalKeywords
];
const overflows = [
  [/^(?:overflow|of)-(.+)$/, ([, v]) => overflowValues.includes(v) ? { overflow: v } : void 0, { autocomplete: [`(overflow|of)-(${overflowValues.join("|")})`, `(overflow|of)-(x|y)-(${overflowValues.join("|")})`] }],
  [/^(?:overflow|of)-([xy])-(.+)$/, ([, d, v]) => overflowValues.includes(v) ? { [`overflow-${d}`]: v } : void 0]
];

const positions = [
  [/^(?:position-|pos-)?(relative|absolute|fixed|sticky)$/, ([, v]) => ({ position: v }), {
    autocomplete: [
      "(position|pos)-<position>",
      "(position|pos)-<globalKeyword>",
      "<position>"
    ]
  }],
  [/^(?:position-|pos-)([-\w]+)$/, ([, v]) => utils.globalKeywords.includes(v) ? { position: v } : void 0],
  [/^(?:position-|pos-)?(static)$/, ([, v]) => ({ position: v })]
];
const justifies = [
  // contents
  ["justify-start", { "justify-content": "flex-start" }],
  ["justify-end", { "justify-content": "flex-end" }],
  ["justify-center", { "justify-content": "center" }],
  ["justify-between", { "justify-content": "space-between" }],
  ["justify-around", { "justify-content": "space-around" }],
  ["justify-evenly", { "justify-content": "space-evenly" }],
  ["justify-stretch", { "justify-content": "stretch" }],
  ["justify-left", { "justify-content": "left" }],
  ["justify-right", { "justify-content": "right" }],
  ...utils.makeGlobalStaticRules("justify", "justify-content"),
  // items
  ["justify-items-start", { "justify-items": "start" }],
  ["justify-items-end", { "justify-items": "end" }],
  ["justify-items-center", { "justify-items": "center" }],
  ["justify-items-stretch", { "justify-items": "stretch" }],
  ...utils.makeGlobalStaticRules("justify-items"),
  // selfs
  ["justify-self-auto", { "justify-self": "auto" }],
  ["justify-self-start", { "justify-self": "start" }],
  ["justify-self-end", { "justify-self": "end" }],
  ["justify-self-center", { "justify-self": "center" }],
  ["justify-self-stretch", { "justify-self": "stretch" }],
  ...utils.makeGlobalStaticRules("justify-self")
];
const orders = [
  [/^order-(.+)$/, ([, v]) => ({ order: utils.h.bracket.cssvar.number(v) })],
  ["order-first", { order: "-9999" }],
  ["order-last", { order: "9999" }],
  ["order-none", { order: "0" }]
];
const alignments = [
  // contents
  ["content-center", { "align-content": "center" }],
  ["content-start", { "align-content": "flex-start" }],
  ["content-end", { "align-content": "flex-end" }],
  ["content-between", { "align-content": "space-between" }],
  ["content-around", { "align-content": "space-around" }],
  ["content-evenly", { "align-content": "space-evenly" }],
  ...utils.makeGlobalStaticRules("content", "align-content"),
  // items
  ["items-start", { "align-items": "flex-start" }],
  ["items-end", { "align-items": "flex-end" }],
  ["items-center", { "align-items": "center" }],
  ["items-baseline", { "align-items": "baseline" }],
  ["items-stretch", { "align-items": "stretch" }],
  ...utils.makeGlobalStaticRules("items", "align-items"),
  // selfs
  ["self-auto", { "align-self": "auto" }],
  ["self-start", { "align-self": "flex-start" }],
  ["self-end", { "align-self": "flex-end" }],
  ["self-center", { "align-self": "center" }],
  ["self-stretch", { "align-self": "stretch" }],
  ["self-baseline", { "align-self": "baseline" }],
  ...utils.makeGlobalStaticRules("self", "align-self")
];
const placements = [
  // contents
  ["place-content-center", { "place-content": "center" }],
  ["place-content-start", { "place-content": "start" }],
  ["place-content-end", { "place-content": "end" }],
  ["place-content-between", { "place-content": "space-between" }],
  ["place-content-around", { "place-content": "space-around" }],
  ["place-content-evenly", { "place-content": "space-evenly" }],
  ["place-content-stretch", { "place-content": "stretch" }],
  ...utils.makeGlobalStaticRules("place-content"),
  // items
  ["place-items-start", { "place-items": "start" }],
  ["place-items-end", { "place-items": "end" }],
  ["place-items-center", { "place-items": "center" }],
  ["place-items-stretch", { "place-items": "stretch" }],
  ...utils.makeGlobalStaticRules("place-items"),
  // selfs
  ["place-self-auto", { "place-self": "auto" }],
  ["place-self-start", { "place-self": "start" }],
  ["place-self-end", { "place-self": "end" }],
  ["place-self-center", { "place-self": "center" }],
  ["place-self-stretch", { "place-self": "stretch" }],
  ...utils.makeGlobalStaticRules("place-self")
];
const flexGridJustifiesAlignments = [...justifies, ...alignments].flatMap(([k, v]) => [
  [`flex-${k}`, v],
  [`grid-${k}`, v]
]);
function handleInsetValue(v, { theme }) {
  return theme.spacing?.[v] ?? utils.h.bracket.cssvar.global.auto.fraction.rem(v);
}
function handleInsetValues([, d, v], ctx) {
  const r = handleInsetValue(v, ctx);
  if (r != null && d in utils.insetMap)
    return utils.insetMap[d].map((i) => [i.slice(1), r]);
}
const insets = [
  [
    /^(?:position-|pos-)?inset-(.+)$/,
    ([, v], ctx) => ({ inset: handleInsetValue(v, ctx) }),
    {
      autocomplete: [
        "(position|pos)-inset-<directions>-$spacing",
        "(position|pos)-inset-(block|inline)-$spacing",
        "(position|pos)-inset-(bs|be|is|ie)-$spacing",
        "(position|pos)-(top|left|right|bottom)-$spacing"
      ]
    }
  ],
  [/^(?:position-|pos-)?(start|end)-(.+)$/, handleInsetValues],
  [/^(?:position-|pos-)?inset-([xy])-(.+)$/, handleInsetValues],
  [/^(?:position-|pos-)?inset-([rltbse])-(.+)$/, handleInsetValues],
  [/^(?:position-|pos-)?inset-(block|inline)-(.+)$/, handleInsetValues],
  [/^(?:position-|pos-)?inset-([bi][se])-(.+)$/, handleInsetValues],
  [/^(?:position-|pos-)?(top|left|right|bottom)-(.+)$/, ([, d, v], ctx) => ({ [d]: handleInsetValue(v, ctx) })]
];
const floats = [
  // floats
  ["float-left", { float: "left" }],
  ["float-right", { float: "right" }],
  ["float-none", { float: "none" }],
  ...utils.makeGlobalStaticRules("float"),
  // clears
  ["clear-left", { clear: "left" }],
  ["clear-right", { clear: "right" }],
  ["clear-both", { clear: "both" }],
  ["clear-none", { clear: "none" }],
  ...utils.makeGlobalStaticRules("clear")
];
const zIndexes = [
  [/^(?:position-|pos-)?z([\d.]+)$/, ([, v]) => ({ "z-index": utils.h.number(v) })],
  [/^(?:position-|pos-)?z-(.+)$/, ([, v], { theme }) => ({ "z-index": theme.zIndex?.[v] ?? utils.h.bracket.cssvar.global.auto.number(v) }), { autocomplete: "z-<num>" }]
];
const boxSizing = [
  ["box-border", { "box-sizing": "border-box" }],
  ["box-content", { "box-sizing": "content-box" }],
  ...utils.makeGlobalStaticRules("box", "box-sizing")
];

const sizeMapping = {
  h: "height",
  w: "width",
  inline: "inline-size",
  block: "block-size"
};
function getPropName(minmax, hw) {
  return `${minmax || ""}${sizeMapping[hw]}`;
}
function getSizeValue(minmax, hw, theme, prop) {
  const str = getPropName(minmax, hw).replace(/-(\w)/g, (_, p) => p.toUpperCase());
  const v = theme[str]?.[prop];
  if (v != null)
    return v;
  switch (prop) {
    case "fit":
    case "max":
    case "min":
      return `${prop}-content`;
  }
  return utils.h.bracket.cssvar.global.auto.fraction.rem(prop);
}
const sizes = [
  [/^(?:size-)?(min-|max-)?([wh])-?(.+)$/, ([, m, w, s], { theme }) => ({ [getPropName(m, w)]: getSizeValue(m, w, theme, s) })],
  [/^(?:size-)?(min-|max-)?(block|inline)-(.+)$/, ([, m, w, s], { theme }) => ({ [getPropName(m, w)]: getSizeValue(m, w, theme, s) }), {
    autocomplete: [
      "(w|h)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize",
      "(block|inline)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize",
      "(max|min)-(w|h|block|inline)",
      "(max|min)-(w|h|block|inline)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize",
      "(w|h)-full",
      "(max|min)-(w|h)-full"
    ]
  }],
  [/^(?:size-)?(min-|max-)?(h)-screen-(.+)$/, ([, m, h2, p], context) => ({ [getPropName(m, h2)]: handleBreakpoint(context, p, "verticalBreakpoints") })],
  [/^(?:size-)?(min-|max-)?(w)-screen-(.+)$/, ([, m, w, p], context) => ({ [getPropName(m, w)]: handleBreakpoint(context, p) }), {
    autocomplete: [
      "(w|h)-screen",
      "(min|max)-(w|h)-screen",
      "h-screen-$verticalBreakpoints",
      "(min|max)-h-screen-$verticalBreakpoints",
      "w-screen-$breakpoints",
      "(min|max)-w-screen-$breakpoints"
    ]
  }]
];
function handleBreakpoint(context, point, key = "breakpoints") {
  const bp = utils.resolveBreakpoints(context, key);
  if (bp)
    return bp.find((i) => i.point === point)?.size;
}
function getAspectRatio(prop) {
  if (/^\d+\/\d+$/.test(prop))
    return prop;
  switch (prop) {
    case "square":
      return "1/1";
    case "video":
      return "16/9";
  }
  return utils.h.bracket.cssvar.global.auto.number(prop);
}
const aspectRatio = [
  [/^(?:size-)?aspect-(?:ratio-)?(.+)$/, ([, d]) => ({ "aspect-ratio": getAspectRatio(d) }), { autocomplete: ["aspect-(square|video|ratio)", "aspect-ratio-(square|video)"] }]
];

const paddings = [
  [/^pa?()-?(-?.+)$/, utils.directionSize("padding"), { autocomplete: ["(m|p)<num>", "(m|p)-<num>"] }],
  [/^p-?xy()()$/, utils.directionSize("padding"), { autocomplete: "(m|p)-(xy)" }],
  [/^p-?([xy])(?:-?(-?.+))?$/, utils.directionSize("padding")],
  [/^p-?([rltbse])(?:-?(-?.+))?$/, utils.directionSize("padding"), { autocomplete: "(m|p)<directions>-<num>" }],
  [/^p-(block|inline)(?:-(-?.+))?$/, utils.directionSize("padding"), { autocomplete: "(m|p)-(block|inline)-<num>" }],
  [/^p-?([bi][se])(?:-?(-?.+))?$/, utils.directionSize("padding"), { autocomplete: "(m|p)-(bs|be|is|ie)-<num>" }]
];
const margins = [
  [/^ma?()-?(-?.+)$/, utils.directionSize("margin")],
  [/^m-?xy()()$/, utils.directionSize("margin")],
  [/^m-?([xy])(?:-?(-?.+))?$/, utils.directionSize("margin")],
  [/^m-?([rltbse])(?:-?(-?.+))?$/, utils.directionSize("margin")],
  [/^m-(block|inline)(?:-(-?.+))?$/, utils.directionSize("margin")],
  [/^m-?([bi][se])(?:-?(-?.+))?$/, utils.directionSize("margin")]
];

const variablesAbbrMap = {
  backface: "backface-visibility",
  break: "word-break",
  case: "text-transform",
  content: "align-content",
  fw: "font-weight",
  items: "align-items",
  justify: "justify-content",
  select: "user-select",
  self: "align-self",
  vertical: "vertical-align",
  visible: "visibility",
  whitespace: "white-space",
  ws: "white-space"
};
const cssVariables = [
  [/^(.+?)-(\$.+)$/, ([, name, varname]) => {
    const prop = variablesAbbrMap[name];
    if (prop)
      return { [prop]: utils.h.cssvar(varname) };
  }]
];
const cssProperty = [
  [/^\[(.*)\]$/, ([_, body], { theme }) => {
    if (!body.includes(":"))
      return;
    const [prop, ...rest] = body.split(":");
    const value = rest.join(":");
    if (!isURI(body) && prop.match(/^[a-z-]+$/) && isValidCSSBody(value)) {
      let parsed;
      if (ruleUtils.hasThemeFn(value))
        parsed = ruleUtils.transformThemeFn(value, theme);
      if (!parsed || parsed === value)
        parsed = utils.h.bracket(`[${value}]`);
      if (parsed)
        return { [prop]: parsed };
    }
  }]
];
function isValidCSSBody(body) {
  let i = 0;
  function findUntil(c) {
    while (i < body.length) {
      i += 1;
      const char = body[i];
      if (char === c)
        return true;
    }
    return false;
  }
  for (i = 0; i < body.length; i++) {
    const c = body[i];
    if ("\"`'".includes(c)) {
      if (!findUntil(c))
        return false;
    } else if (c === "(") {
      if (!findUntil(")"))
        return false;
    } else if ("[]{}:".includes(c)) {
      return false;
    }
  }
  return true;
}
function isURI(declaration) {
  if (!declaration.includes("://"))
    return false;
  try {
    return new URL(declaration).host !== "";
  } catch (err) {
    return false;
  }
}

const questionMark = [
  [
    /^(where|\?)$/,
    (_, { constructCSS, generator }) => {
      if (generator.userConfig.envMode === "dev")
        return `@keyframes __un_qm{0%{box-shadow:inset 4px 4px #ff1e90, inset -4px -4px #ff1e90}100%{box-shadow:inset 8px 8px #3399ff, inset -8px -8px #3399ff}}
${constructCSS({ animation: "__un_qm 0.5s ease-in-out alternate infinite" })}`;
    }
  ]
];

const svgUtilities = [
  // fills
  [/^fill-(.+)$/, utils.colorResolver("fill", "fill", "backgroundColor"), { autocomplete: "fill-$colors" }],
  [/^fill-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ "--un-fill-opacity": utils.h.bracket.percent.cssvar(opacity) }), { autocomplete: "fill-(op|opacity)-<percent>" }],
  ["fill-none", { fill: "none" }],
  // stroke size
  [/^stroke-(?:width-|size-)?(.+)$/, ([, s], { theme }) => ({ "stroke-width": theme.lineWidth?.[s] ?? utils.h.bracket.cssvar.fraction.px.number(s) }), { autocomplete: ["stroke-width-$lineWidth", "stroke-size-$lineWidth"] }],
  // stroke dash
  [/^stroke-dash-(.+)$/, ([, s]) => ({ "stroke-dasharray": utils.h.bracket.cssvar.number(s) }), { autocomplete: "stroke-dash-<num>" }],
  [/^stroke-offset-(.+)$/, ([, s], { theme }) => ({ "stroke-dashoffset": theme.lineWidth?.[s] ?? utils.h.bracket.cssvar.px.numberWithUnit(s) }), { autocomplete: "stroke-offset-$lineWidth" }],
  // stroke colors
  [/^stroke-(.+)$/, utils.colorResolver("stroke", "stroke", "borderColor"), { autocomplete: "stroke-$colors" }],
  [/^stroke-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ "--un-stroke-opacity": utils.h.bracket.percent.cssvar(opacity) }), { autocomplete: "stroke-(op|opacity)-<percent>" }],
  // line cap
  ["stroke-cap-square", { "stroke-linecap": "square" }],
  ["stroke-cap-round", { "stroke-linecap": "round" }],
  ["stroke-cap-auto", { "stroke-linecap": "butt" }],
  // line join
  ["stroke-join-arcs", { "stroke-linejoin": "arcs" }],
  ["stroke-join-bevel", { "stroke-linejoin": "bevel" }],
  ["stroke-join-clip", { "stroke-linejoin": "miter-clip" }],
  ["stroke-join-round", { "stroke-linejoin": "round" }],
  ["stroke-join-auto", { "stroke-linejoin": "miter" }],
  // none
  ["stroke-none", { stroke: "none" }]
];

const rules = [
  cssVariables,
  cssProperty,
  paddings,
  margins,
  transform.displays,
  opacity,
  bgColors,
  colorScheme,
  svgUtilities,
  borders,
  transform.contentVisibility,
  transform.contents,
  fonts,
  tabSizes,
  textIndents,
  transform.textOverflows,
  textDecorations,
  textStrokes,
  textShadows,
  transform.textTransforms,
  textAligns,
  textColors,
  transform.fontStyles,
  transform.fontSmoothings,
  transform.boxShadows,
  transform.rings,
  flex,
  grids,
  gaps,
  positions,
  sizes,
  aspectRatio,
  transform.cursors,
  transform.appearances,
  transform.pointerEvents,
  transform.resizes,
  verticalAligns,
  transform.userSelects,
  transform.whitespaces,
  transform.breaks,
  overflows,
  outline,
  appearance,
  orders,
  justifies,
  alignments,
  placements,
  flexGridJustifiesAlignments,
  insets,
  floats,
  zIndexes,
  boxSizing,
  transitions,
  transform.transforms,
  willChange,
  containerParent,
  transform.contains,
  transform.textWraps,
  // should be the last
  questionMark
].flat(1);

exports.appearances = transform.appearances;
exports.boxShadows = transform.boxShadows;
exports.boxShadowsBase = transform.boxShadowsBase;
exports.breaks = transform.breaks;
exports.contains = transform.contains;
exports.contentVisibility = transform.contentVisibility;
exports.contents = transform.contents;
exports.cursors = transform.cursors;
exports.displays = transform.displays;
exports.fontSmoothings = transform.fontSmoothings;
exports.fontStyles = transform.fontStyles;
exports.pointerEvents = transform.pointerEvents;
exports.resizes = transform.resizes;
exports.ringBase = transform.ringBase;
exports.rings = transform.rings;
exports.textOverflows = transform.textOverflows;
exports.textTransforms = transform.textTransforms;
exports.textWraps = transform.textWraps;
exports.transformBase = transform.transformBase;
exports.transforms = transform.transforms;
exports.userSelects = transform.userSelects;
exports.varEmpty = transform.varEmpty;
exports.whitespaces = transform.whitespaces;
exports.alignments = alignments;
exports.appearance = appearance;
exports.aspectRatio = aspectRatio;
exports.bgColors = bgColors;
exports.borderStyles = borderStyles;
exports.borders = borders;
exports.boxSizing = boxSizing;
exports.colorScheme = colorScheme;
exports.containerParent = containerParent;
exports.cssProperty = cssProperty;
exports.cssVariables = cssVariables;
exports.flex = flex;
exports.flexGridJustifiesAlignments = flexGridJustifiesAlignments;
exports.floats = floats;
exports.fonts = fonts;
exports.gaps = gaps;
exports.grids = grids;
exports.handlerBorderStyle = handlerBorderStyle;
exports.insets = insets;
exports.justifies = justifies;
exports.margins = margins;
exports.opacity = opacity;
exports.orders = orders;
exports.outline = outline;
exports.overflows = overflows;
exports.paddings = paddings;
exports.placements = placements;
exports.positions = positions;
exports.questionMark = questionMark;
exports.rules = rules;
exports.sizes = sizes;
exports.svgUtilities = svgUtilities;
exports.tabSizes = tabSizes;
exports.textAligns = textAligns;
exports.textColors = textColors;
exports.textDecorations = textDecorations;
exports.textIndents = textIndents;
exports.textShadows = textShadows;
exports.textStrokes = textStrokes;
exports.transitions = transitions;
exports.verticalAligns = verticalAligns;
exports.willChange = willChange;
exports.zIndexes = zIndexes;
