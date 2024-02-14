import * as I18nInternals from "../i18n/index.js";
import { normalizeTheLocale, toCodes, toPaths } from "../i18n/index.js";
const { trailingSlash, format, site, i18n } = __ASTRO_INTERNAL_I18N_CONFIG__;
const { defaultLocale, locales, routing } = i18n;
const base = import.meta.env.BASE_URL;
const getRelativeLocaleUrl = (locale, path, options) => I18nInternals.getLocaleRelativeUrl({
  locale,
  path,
  base,
  trailingSlash,
  format,
  defaultLocale,
  locales,
  routing,
  ...options
});
const getAbsoluteLocaleUrl = (locale, path = "", options) => I18nInternals.getLocaleAbsoluteUrl({
  locale,
  path,
  base,
  trailingSlash,
  format,
  site,
  defaultLocale,
  locales,
  routing,
  ...options
});
const getRelativeLocaleUrlList = (path, options) => I18nInternals.getLocaleRelativeUrlList({
  base,
  path,
  trailingSlash,
  format,
  defaultLocale,
  locales,
  routing,
  ...options
});
const getAbsoluteLocaleUrlList = (path, options) => I18nInternals.getLocaleAbsoluteUrlList({
  site,
  base,
  path,
  trailingSlash,
  format,
  defaultLocale,
  locales,
  routing,
  ...options
});
const getPathByLocale = (locale) => I18nInternals.getPathByLocale(locale, locales);
const getLocaleByPath = (path) => I18nInternals.getLocaleByPath(path, locales);
export {
  getAbsoluteLocaleUrl,
  getAbsoluteLocaleUrlList,
  getLocaleByPath,
  getPathByLocale,
  getRelativeLocaleUrl,
  getRelativeLocaleUrlList,
  normalizeTheLocale,
  toCodes,
  toPaths
};
