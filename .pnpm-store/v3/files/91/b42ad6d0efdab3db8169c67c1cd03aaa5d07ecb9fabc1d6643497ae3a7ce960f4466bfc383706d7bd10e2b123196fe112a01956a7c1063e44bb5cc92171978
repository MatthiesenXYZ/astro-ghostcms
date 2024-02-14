import { appendForwardSlash, joinPaths } from "@astrojs/internal-helpers/path";
import { getPathByLocale, normalizeTheLocale } from "./index.js";
import { shouldAppendForwardSlash } from "../core/build/util.js";
import { ROUTE_DATA_SYMBOL } from "../core/constants.js";
const routeDataSymbol = Symbol.for(ROUTE_DATA_SYMBOL);
function pathnameHasLocale(pathname, locales) {
  const segments = pathname.split("/");
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function createI18nMiddleware(i18n, base, trailingSlash, buildFormat) {
  if (!i18n)
    return (_, next) => next();
  const prefixAlways = (url, response, context) => {
    if (url.pathname === base + "/" || url.pathname === base) {
      if (shouldAppendForwardSlash(trailingSlash, buildFormat)) {
        return context.redirect(`${appendForwardSlash(joinPaths(base, i18n.defaultLocale))}`);
      } else {
        return context.redirect(`${joinPaths(base, i18n.defaultLocale)}`);
      }
    } else if (!pathnameHasLocale(url.pathname, i18n.locales)) {
      return new Response(null, {
        status: 404,
        headers: response.headers
      });
    }
    return void 0;
  };
  const prefixOtherLocales = (url, response) => {
    const pathnameContainsDefaultLocale = url.pathname.includes(`/${i18n.defaultLocale}`);
    if (pathnameContainsDefaultLocale) {
      const newLocation = url.pathname.replace(`/${i18n.defaultLocale}`, "");
      response.headers.set("Location", newLocation);
      return new Response(null, {
        status: 404,
        headers: response.headers
      });
    }
    return void 0;
  };
  const prefixAlwaysNoRedirect = (url, response) => {
    const isRoot = url.pathname === base + "/" || url.pathname === base;
    if (!(isRoot || pathnameHasLocale(url.pathname, i18n.locales))) {
      return new Response(null, {
        status: 404,
        headers: response.headers
      });
    }
    return void 0;
  };
  return async (context, next) => {
    const routeData = Reflect.get(context.request, routeDataSymbol);
    if (routeData?.type !== "page" && routeData?.type !== "fallback") {
      return await next();
    }
    const currentLocale = context.currentLocale;
    const url = context.url;
    const { locales, defaultLocale, fallback, routing } = i18n;
    const response = await next();
    if (response instanceof Response) {
      switch (i18n.routing) {
        case "domains-prefix-other-locales": {
          if (localeHasntDomain(i18n, currentLocale)) {
            const result = prefixOtherLocales(url, response);
            if (result) {
              return result;
            }
          }
          break;
        }
        case "pathname-prefix-other-locales": {
          const result = prefixOtherLocales(url, response);
          if (result) {
            return result;
          }
          break;
        }
        case "domains-prefix-other-no-redirect": {
          if (localeHasntDomain(i18n, currentLocale)) {
            const result = prefixAlwaysNoRedirect(url, response);
            if (result) {
              return result;
            }
          }
          break;
        }
        case "pathname-prefix-always-no-redirect": {
          const result = prefixAlwaysNoRedirect(url, response);
          if (result) {
            return result;
          }
          break;
        }
        case "pathname-prefix-always": {
          const result = prefixAlways(url, response, context);
          if (result) {
            return result;
          }
          break;
        }
        case "domains-prefix-always": {
          if (localeHasntDomain(i18n, currentLocale)) {
            const result = prefixAlways(url, response, context);
            if (result) {
              return result;
            }
          }
          break;
        }
      }
      if (response.status >= 300 && fallback) {
        const fallbackKeys = i18n.fallback ? Object.keys(i18n.fallback) : [];
        const segments = url.pathname.split("/");
        const urlLocale = segments.find((segment) => {
          for (const locale of locales) {
            if (typeof locale === "string") {
              if (locale === segment) {
                return true;
              }
            } else if (locale.path === segment) {
              return true;
            }
          }
          return false;
        });
        if (urlLocale && fallbackKeys.includes(urlLocale)) {
          const fallbackLocale = fallback[urlLocale];
          const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
          let newPathname;
          if (pathFallbackLocale === defaultLocale && routing === "pathname-prefix-other-locales") {
            newPathname = url.pathname.replace(`/${urlLocale}`, ``);
          } else {
            newPathname = url.pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
          }
          return context.redirect(newPathname);
        }
      }
    }
    return response;
  };
}
const i18nPipelineHook = (ctx) => {
  Reflect.set(ctx.request, routeDataSymbol, ctx.route);
};
function localeHasntDomain(i18n, currentLocale) {
  for (const domainLocale of Object.values(i18n.domainLookupTable)) {
    if (domainLocale === currentLocale) {
      return false;
    }
  }
  return true;
}
export {
  createI18nMiddleware,
  i18nPipelineHook
};
