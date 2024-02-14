import { c as createCDNLoader } from './shared/preset-icons.QPsUVTPe.mjs';
import { c as createPresetIcons, b as createCDNFetchLoader, l as loadIcon } from './shared/preset-icons.Qrc-gCsq.mjs';
export { a as combineLoaders, i as icons } from './shared/preset-icons.Qrc-gCsq.mjs';
import 'ofetch';
import '@unocss/core';

const presetIcons = createPresetIcons(async (options) => {
  const fetcher = options?.customFetch;
  const cdn = options?.cdn;
  if (fetcher && cdn)
    return createCDNFetchLoader(fetcher, cdn);
  if (cdn)
    return createCDNLoader(cdn);
  return loadIcon;
});

export { createCDNFetchLoader, createPresetIcons, presetIcons as default, presetIcons };
