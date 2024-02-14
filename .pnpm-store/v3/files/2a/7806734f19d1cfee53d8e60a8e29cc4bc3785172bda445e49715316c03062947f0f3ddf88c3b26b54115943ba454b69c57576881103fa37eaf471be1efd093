import { appendForwardSlash, joinPaths } from "@astrojs/internal-helpers/path";
import { shouldAppendForwardSlash } from "../core/build/util.js";
import { MissingLocale } from "../core/errors/errors-data.js";
import { AstroError } from "../core/errors/index.js";
function getLocaleRelativeUrl({
  locale,
  base,
  locales: _locales,
  trailingSlash,
  format,
  path,
  prependWith,
  normalizeLocale = true,
  routing = "pathname-prefix-other-locales",
  defaultLocale
}) {
  const codeToUse = peekCodePathToUse(_locales, locale);
  if (!codeToUse) {
    throw new AstroError({
      ...MissingLocale,
      message: MissingLocale.message(locale)
    });
  }
  const pathsToJoin = [base, prependWith];
  const normalizedLocale = normalizeLocale ? normalizeTheLocale(codeToUse) : codeToUse;
  if (routing === "pathname-prefix-always" || routing === "pathname-prefix-always-no-redirect") {
    pathsToJoin.push(normalizedLocale);
  } else if (locale !== defaultLocale) {
    pathsToJoin.push(normalizedLocale);
  }
  pathsToJoin.push(path);
  if (shouldAppendForwardSlash(trailingSlash, format)) {
    return appendForwardSlash(joinPaths(...pathsToJoin));
  } else {
    return joinPaths(...pathsToJoin);
  }
}
function getLocaleAbsoluteUrl({ site, isBuild, ...rest }) {
  const localeUrl = getLocaleRelativeUrl(rest);
  const { domains, locale } = rest;
  let url;
  if (isBuild && domains) {
    const base = domains[locale];
    url = joinPaths(base, localeUrl.replace(`/${rest.locale}`, ""));
  } else {
    if (site) {
      url = joinPaths(site, localeUrl);
    } else {
      url = localeUrl;
    }
  }
  if (shouldAppendForwardSlash(rest.trailingSlash, rest.format)) {
    return appendForwardSlash(url);
  } else {
    return url;
  }
}
function getLocaleRelativeUrlList({
  base,
  locales: _locales,
  trailingSlash,
  format,
  path,
  prependWith,
  normalizeLocale = true,
  routing = "pathname-prefix-other-locales",
  defaultLocale
}) {
  const locales = toPaths(_locales);
  return locales.map((locale) => {
    const pathsToJoin = [base, prependWith];
    const normalizedLocale = normalizeLocale ? normalizeTheLocale(locale) : locale;
    if (routing === "pathname-prefix-always" || routing === "pathname-prefix-always-no-redirect") {
      pathsToJoin.push(normalizedLocale);
    } else if (locale !== defaultLocale) {
      pathsToJoin.push(normalizedLocale);
    }
    pathsToJoin.push(path);
    if (shouldAppendForwardSlash(trailingSlash, format)) {
      return appendForwardSlash(joinPaths(...pathsToJoin));
    } else {
      return joinPaths(...pathsToJoin);
    }
  });
}
function getLocaleAbsoluteUrlList({
  base,
  locales: _locales,
  trailingSlash,
  format,
  path,
  prependWith,
  normalizeLocale = true,
  routing = "pathname-prefix-other-locales",
  defaultLocale,
  isBuild,
  domains,
  site
}) {
  const locales = toPaths(_locales);
  return locales.map((currentLocale) => {
    const pathsToJoin = [];
    const normalizedLocale = normalizeLocale ? normalizeTheLocale(currentLocale) : currentLocale;
    const domainBase = domains ? domains[currentLocale] : void 0;
    if (isBuild && domainBase) {
      if (domainBase) {
        pathsToJoin.push(domainBase);
      } else {
        pathsToJoin.push(site);
      }
      pathsToJoin.push(base);
      pathsToJoin.push(prependWith);
    } else {
      if (site) {
        pathsToJoin.push(site);
      }
      pathsToJoin.push(base);
      pathsToJoin.push(prependWith);
      if (routing === "pathname-prefix-always" || routing === "pathname-prefix-always-no-redirect") {
        pathsToJoin.push(normalizedLocale);
      } else if (currentLocale !== defaultLocale) {
        pathsToJoin.push(normalizedLocale);
      }
    }
    pathsToJoin.push(path);
    if (shouldAppendForwardSlash(trailingSlash, format)) {
      return appendForwardSlash(joinPaths(...pathsToJoin));
    } else {
      return joinPaths(...pathsToJoin);
    }
  });
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  throw new Unreachable();
}
function getLocaleByPath(path, locales) {
  for (const locale of locales) {
    if (typeof locale !== "string") {
      if (locale.path === path) {
        const code = locale.codes.at(0);
        if (code === void 0)
          throw new Unreachable();
        return code;
      }
    } else if (locale === path) {
      return locale;
    }
  }
  throw new Unreachable();
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function toCodes(locales) {
  const codes = [];
  for (const locale of locales) {
    if (typeof locale === "string") {
      codes.push(locale);
    } else {
      for (const code of locale.codes) {
        codes.push(code);
      }
    }
  }
  return codes;
}
function toPaths(locales) {
  return locales.map((loopLocale) => {
    if (typeof loopLocale === "string") {
      return loopLocale;
    } else {
      return loopLocale.path;
    }
  });
}
function peekCodePathToUse(locales, locale) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  return void 0;
}
class Unreachable extends Error {
  constructor() {
    super(
      "Astro encountered an unexpected line of code.\nIn most cases, this is not your fault, but a bug in astro code.\nIf there isn't one already, please create an issue.\nhttps://astro.build/issues"
    );
  }
}
export {
  getLocaleAbsoluteUrl,
  getLocaleAbsoluteUrlList,
  getLocaleByPath,
  getLocaleRelativeUrl,
  getLocaleRelativeUrlList,
  getPathByLocale,
  normalizeTheLocale,
  toCodes,
  toPaths
};
