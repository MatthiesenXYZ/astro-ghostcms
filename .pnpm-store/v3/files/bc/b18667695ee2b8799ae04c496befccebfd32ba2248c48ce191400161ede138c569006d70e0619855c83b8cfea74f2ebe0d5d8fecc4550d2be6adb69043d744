'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@unocss/core');

const sourceMapRE = /\/\/#\s*sourceMappingURL=.*\n?/g;
function removeSourceMap(code) {
  if (code.includes("sourceMappingURL="))
    return code.replace(sourceMapRE, "");
  return code;
}

const quotedArbitraryValuesRE = /(?:[\w&:[\]-]|\[\S+=\S+\])+\[\\?['"]?\S+?['"]\]\]?[\w:-]*/g;
const arbitraryPropertyRE = /\[(\\\W|[\w-])+:[^\s:]*?("\S+?"|'\S+?'|`\S+?`|[^\s:]+?)[^\s:]*?\)?\]/g;
const arbitraryPropertyCandidateRE = /^\[(\\\W|[\w-])+:['"]?\S+?['"]?\]$/;
function splitCodeWithArbitraryVariants(code) {
  const result = [];
  for (const match of code.matchAll(arbitraryPropertyRE)) {
    if (match.index !== 0 && !code[match.index - 1]?.match(/^[\s'"`]/))
      continue;
    result.push(match[0]);
  }
  for (const match of code.matchAll(quotedArbitraryValuesRE))
    result.push(match[0]);
  code.split(core.defaultSplitRE).forEach((match) => {
    if (core.isValidSelector(match) && !arbitraryPropertyCandidateRE.test(match))
      result.push(match);
  });
  return result;
}
const extractorArbitraryVariants = {
  name: "@unocss/extractor-arbitrary-variants",
  order: 0,
  extract({ code }) {
    return splitCodeWithArbitraryVariants(removeSourceMap(code));
  }
};

exports.arbitraryPropertyRE = arbitraryPropertyRE;
exports.default = extractorArbitraryVariants;
exports.extractorArbitraryVariants = extractorArbitraryVariants;
exports.quotedArbitraryValuesRE = quotedArbitraryValuesRE;
exports.splitCodeWithArbitraryVariants = splitCodeWithArbitraryVariants;
