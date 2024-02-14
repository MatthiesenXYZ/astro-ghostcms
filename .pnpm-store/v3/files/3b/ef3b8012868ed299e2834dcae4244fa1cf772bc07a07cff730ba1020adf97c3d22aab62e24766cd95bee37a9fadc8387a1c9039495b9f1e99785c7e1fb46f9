'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const cdn = require('./shared/preset-icons.h-fIJ5Ug.cjs');
const core = require('./shared/preset-icons.LQSGTH8B.cjs');
require('ofetch');
require('@unocss/core');

async function createNodeLoader() {
  try {
    return await import('@iconify/utils/lib/loader/node-loader').then((i) => i?.loadNodeIcon);
  } catch {
  }
  try {
    return require("@iconify/utils/lib/loader/node-loader.cjs").loadNodeIcon;
  } catch {
  }
}
const presetIcons = core.createPresetIcons(async (options) => {
  const {
    cdn: cdn$1
  } = options;
  const loaders = [];
  const isNode = typeof process !== "undefined" && process.stdout && !process.versions.deno;
  const isVSCode = isNode && !!process.env.VSCODE_CWD;
  const isESLint = isNode && !!process.env.ESLINT;
  if (isNode && !isVSCode && !isESLint) {
    const nodeLoader = await createNodeLoader();
    if (nodeLoader !== void 0)
      loaders.push(nodeLoader);
  }
  if (cdn$1)
    loaders.push(cdn.createCDNLoader(cdn$1));
  loaders.push(core.loadIcon);
  return core.combineLoaders(loaders);
});

exports.combineLoaders = core.combineLoaders;
exports.createCDNFetchLoader = core.createCDNFetchLoader;
exports.createPresetIcons = core.createPresetIcons;
exports.icons = core.icons;
exports.default = presetIcons;
exports.presetIcons = presetIcons;
