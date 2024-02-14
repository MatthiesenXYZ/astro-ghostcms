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
  return async (context, next) => {
    const routeData = Reflect.get(context.request, routeDataSymbol);
    if (routeData?.type !== "page" && routeData?.type !== "fallback") {
      return await next();
    }
    const url = context.url;
    const { locales, defaultLocale, fallback, routing } = i18n;
    const response = await next();
    if (response instanceof Response) {
      const pathnameContainsDefaultLocale = url.pathname.includes(`/${defaultLocale}`);
      switch (i18n.routing) {
        case "pathname-prefix-other-locales": {
          if (pathnameContainsDefaultLocale) {
            const newLocation = url.pathname.replace(`/${defaultLocale}`, "");
            response.headers.set("Location", newLocation);
            return new Response(null, {
              status: 404,
              headers: response.headers
            });
          }
          break;
        }
        case "pathname-prefix-always-no-redirect": {
          const isRoot = url.pathname === base + "/" || url.pathname === base;
          if (!(isRoot || pathnameHasLocale(url.pathname, i18n.locales))) {
            return new Response(null, {
              status: 404,
              headers: response.headers
            });
          }
          break;
        }
        case "pathname-prefix-always": {
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
export {
  createI18nMiddleware,
  i18nPipelineHook
};
