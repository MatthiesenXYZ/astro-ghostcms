import { createI18nMiddleware, i18nPipelineHook } from "../../i18n/middleware.js";
import { REROUTE_DIRECTIVE_HEADER } from "../../runtime/server/consts.js";
import { getSetCookiesFromResponse } from "../cookies/index.js";
import { consoleLogDestination } from "../logger/console.js";
import { AstroIntegrationLogger, Logger } from "../logger/core.js";
import { sequence } from "../middleware/index.js";
import {
  appendForwardSlash,
  collapseDuplicateSlashes,
  joinPaths,
  prependForwardSlash,
  removeTrailingForwardSlash
} from "../path.js";
import { RedirectSinglePageBuiltModule } from "../redirects/index.js";
import { createEnvironment, createRenderContext } from "../render/index.js";
import { RouteCache } from "../render/route-cache.js";
import {
  createAssetLink,
  createModuleScriptElement,
  createStylesheetElementSet
} from "../render/ssr-element.js";
import { matchRoute } from "../routing/match.js";
import { SSRRoutePipeline } from "./ssrPipeline.js";
import { normalizeTheLocale } from "../../i18n/index.js";
import { deserializeManifest } from "./common.js";
const localsSymbol = Symbol.for("astro.locals");
const clientAddressSymbol = Symbol.for("astro.clientAddress");
const responseSentSymbol = Symbol.for("astro.responseSent");
const REROUTABLE_STATUS_CODES = /* @__PURE__ */ new Set([404, 500]);
class App {
  /**
   * The current environment of the application
   */
  #manifest;
  #manifestData;
  #routeDataToRouteInfo;
  #logger = new Logger({
    dest: consoleLogDestination,
    level: "info"
  });
  #baseWithoutTrailingSlash;
  #pipeline;
  #adapterLogger;
  #renderOptionsDeprecationWarningShown = false;
  constructor(manifest, streaming = true) {
    this.#manifest = manifest;
    this.#manifestData = {
      routes: manifest.routes.map((route) => route.routeData)
    };
    this.#routeDataToRouteInfo = new Map(manifest.routes.map((route) => [route.routeData, route]));
    this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#manifest.base);
    this.#pipeline = new SSRRoutePipeline(this.#createEnvironment(streaming));
    this.#adapterLogger = new AstroIntegrationLogger(
      this.#logger.options,
      this.#manifest.adapterName
    );
  }
  getAdapterLogger() {
    return this.#adapterLogger;
  }
  /**
   * Creates an environment by reading the stored manifest
   *
   * @param streaming
   * @private
   */
  #createEnvironment(streaming = false) {
    return createEnvironment({
      adapterName: this.#manifest.adapterName,
      logger: this.#logger,
      mode: "production",
      compressHTML: this.#manifest.compressHTML,
      renderers: this.#manifest.renderers,
      clientDirectives: this.#manifest.clientDirectives,
      resolve: async (specifier) => {
        if (!(specifier in this.#manifest.entryModules)) {
          throw new Error(`Unable to resolve [${specifier}]`);
        }
        const bundlePath = this.#manifest.entryModules[specifier];
        switch (true) {
          case bundlePath.startsWith("data:"):
          case bundlePath.length === 0: {
            return bundlePath;
          }
          default: {
            return createAssetLink(bundlePath, this.#manifest.base, this.#manifest.assetsPrefix);
          }
        }
      },
      routeCache: new RouteCache(this.#logger),
      site: this.#manifest.site,
      ssr: true,
      streaming
    });
  }
  set setManifestData(newManifestData) {
    this.#manifestData = newManifestData;
  }
  removeBase(pathname) {
    if (pathname.startsWith(this.#manifest.base)) {
      return pathname.slice(this.#baseWithoutTrailingSlash.length + 1);
    }
    return pathname;
  }
  #getPathnameFromRequest(request) {
    const url = new URL(request.url);
    const pathname = prependForwardSlash(this.removeBase(url.pathname));
    return pathname;
  }
  match(request) {
    const url = new URL(request.url);
    if (this.#manifest.assets.has(url.pathname))
      return void 0;
    let pathname = this.#computePathnameFromDomain(request);
    if (!pathname) {
      pathname = prependForwardSlash(this.removeBase(url.pathname));
    }
    let routeData = matchRoute(pathname, this.#manifestData);
    if (!routeData || routeData.prerender)
      return void 0;
    return routeData;
  }
  #computePathnameFromDomain(request) {
    let pathname = void 0;
    const url = new URL(request.url);
    if (this.#manifest.i18n && (this.#manifest.i18n.routing === "domains-prefix-always" || this.#manifest.i18n.routing === "domains-prefix-other-locales" || this.#manifest.i18n.routing === "domains-prefix-other-no-redirect")) {
      let host = request.headers.get("X-Forwarded-Host");
      let protocol = request.headers.get("X-Forwarded-Proto");
      if (protocol) {
        protocol = protocol + ":";
      } else {
        protocol = url.protocol;
      }
      if (!host) {
        host = request.headers.get("Host");
      }
      if (host && protocol) {
        host = host.split(":")[0];
        try {
          let locale;
          const hostAsUrl = new URL(`${protocol}//${host}`);
          for (const [domainKey, localeValue] of Object.entries(
            this.#manifest.i18n.domainLookupTable
          )) {
            const domainKeyAsUrl = new URL(domainKey);
            if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
              locale = localeValue;
              break;
            }
          }
          if (locale) {
            pathname = prependForwardSlash(
              joinPaths(normalizeTheLocale(locale), this.removeBase(url.pathname))
            );
            if (url.pathname.endsWith("/")) {
              pathname = appendForwardSlash(pathname);
            }
          }
        } catch (e) {
          this.#logger.error(
            "router",
            `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`
          );
          this.#logger.error("router", `Error: ${e}`);
        }
      }
    }
    return pathname;
  }
  async render(request, routeDataOrOptions, maybeLocals) {
    let routeData;
    let locals;
    let clientAddress;
    let addCookieHeader;
    if (routeDataOrOptions && ("addCookieHeader" in routeDataOrOptions || "clientAddress" in routeDataOrOptions || "locals" in routeDataOrOptions || "routeData" in routeDataOrOptions)) {
      if ("addCookieHeader" in routeDataOrOptions) {
        addCookieHeader = routeDataOrOptions.addCookieHeader;
      }
      if ("clientAddress" in routeDataOrOptions) {
        clientAddress = routeDataOrOptions.clientAddress;
      }
      if ("routeData" in routeDataOrOptions) {
        routeData = routeDataOrOptions.routeData;
      }
      if ("locals" in routeDataOrOptions) {
        locals = routeDataOrOptions.locals;
      }
    } else {
      routeData = routeDataOrOptions;
      locals = maybeLocals;
      if (routeDataOrOptions || locals) {
        this.#logRenderOptionsDeprecationWarning();
      }
    }
    if (locals) {
      Reflect.set(request, localsSymbol, locals);
    }
    if (clientAddress) {
      Reflect.set(request, clientAddressSymbol, clientAddress);
    }
    if (request.url !== collapseDuplicateSlashes(request.url)) {
      request = new Request(collapseDuplicateSlashes(request.url), request);
    }
    if (!routeData) {
      routeData = this.match(request);
    }
    if (!routeData) {
      return this.#renderError(request, { status: 404 });
    }
    const pathname = this.#getPathnameFromRequest(request);
    const defaultStatus = this.#getDefaultStatusCode(routeData, pathname);
    const mod = await this.#getModuleForRoute(routeData);
    const pageModule = await mod.page();
    const url = new URL(request.url);
    const renderContext = await this.#createRenderContext(
      url,
      request,
      routeData,
      mod,
      defaultStatus
    );
    let response;
    try {
      const i18nMiddleware = createI18nMiddleware(
        this.#manifest.i18n,
        this.#manifest.base,
        this.#manifest.trailingSlash,
        this.#manifest.buildFormat
      );
      if (i18nMiddleware) {
        this.#pipeline.setMiddlewareFunction(sequence(i18nMiddleware, this.#manifest.middleware));
        this.#pipeline.onBeforeRenderRoute(i18nPipelineHook);
      } else {
        this.#pipeline.setMiddlewareFunction(this.#manifest.middleware);
      }
      response = await this.#pipeline.renderRoute(renderContext, pageModule);
    } catch (err) {
      this.#logger.error(null, err.stack || err.message || String(err));
      return this.#renderError(request, { status: 500 });
    }
    if (REROUTABLE_STATUS_CODES.has(response.status) && response.headers.get(REROUTE_DIRECTIVE_HEADER) !== "no") {
      return this.#renderError(request, {
        response,
        status: response.status
      });
    }
    if (response.headers.has(REROUTE_DIRECTIVE_HEADER)) {
      response.headers.delete(REROUTE_DIRECTIVE_HEADER);
    }
    if (addCookieHeader) {
      for (const setCookieHeaderValue of App.getSetCookieFromResponse(response)) {
        response.headers.append("set-cookie", setCookieHeaderValue);
      }
    }
    Reflect.set(response, responseSentSymbol, true);
    return response;
  }
  #logRenderOptionsDeprecationWarning() {
    if (this.#renderOptionsDeprecationWarningShown)
      return;
    this.#logger.warn(
      "deprecated",
      `The adapter ${this.#manifest.adapterName} is using a deprecated signature of the 'app.render()' method. From Astro 4.0, locals and routeData are provided as properties on an optional object to this method. Using the old signature will cause an error in Astro 5.0. See https://github.com/withastro/astro/pull/9199 for more information.`
    );
    this.#renderOptionsDeprecationWarningShown = true;
  }
  setCookieHeaders(response) {
    return getSetCookiesFromResponse(response);
  }
  /**
   * Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
   * For example,
   * ```ts
   * for (const cookie_ of App.getSetCookieFromResponse(response)) {
   *     const cookie: string = cookie_
   * }
   * ```
   * @param response The response to read cookies from.
   * @returns An iterator that yields key-value pairs as equal-sign-separated strings.
   */
  static getSetCookieFromResponse = getSetCookiesFromResponse;
  /**
   * Creates the render context of the current route
   */
  async #createRenderContext(url, request, routeData, page, status = 200) {
    if (routeData.type === "endpoint") {
      const pathname = "/" + this.removeBase(url.pathname);
      const mod = await page.page();
      const handler = mod;
      return await createRenderContext({
        request,
        pathname,
        route: routeData,
        status,
        env: this.#pipeline.env,
        mod: handler,
        locales: this.#manifest.i18n?.locales,
        routing: this.#manifest.i18n?.routing,
        defaultLocale: this.#manifest.i18n?.defaultLocale
      });
    } else {
      const pathname = prependForwardSlash(this.removeBase(url.pathname));
      const info = this.#routeDataToRouteInfo.get(routeData);
      const links = /* @__PURE__ */ new Set();
      const styles = createStylesheetElementSet(info.styles);
      let scripts = /* @__PURE__ */ new Set();
      for (const script of info.scripts) {
        if ("stage" in script) {
          if (script.stage === "head-inline") {
            scripts.add({
              props: {},
              children: script.children
            });
          }
        } else {
          scripts.add(createModuleScriptElement(script));
        }
      }
      const mod = await page.page();
      return await createRenderContext({
        request,
        pathname,
        componentMetadata: this.#manifest.componentMetadata,
        scripts,
        styles,
        links,
        route: routeData,
        status,
        mod,
        env: this.#pipeline.env,
        locales: this.#manifest.i18n?.locales,
        routing: this.#manifest.i18n?.routing,
        defaultLocale: this.#manifest.i18n?.defaultLocale
      });
    }
  }
  /**
   * If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
   * This also handles pre-rendered /404 or /500 routes
   */
  async #renderError(request, { status, response: originalResponse, skipMiddleware = false }) {
    const errorRoutePath = `/${status}${this.#manifest.trailingSlash === "always" ? "/" : ""}`;
    const errorRouteData = matchRoute(errorRoutePath, this.#manifestData);
    const url = new URL(request.url);
    if (errorRouteData) {
      if (errorRouteData.prerender) {
        const maybeDotHtml = errorRouteData.route.endsWith(`/${status}`) ? ".html" : "";
        const statusURL = new URL(
          `${this.#baseWithoutTrailingSlash}/${status}${maybeDotHtml}`,
          url
        );
        const response2 = await fetch(statusURL.toString());
        const override = { status };
        return this.#mergeResponses(response2, originalResponse, override);
      }
      const mod = await this.#getModuleForRoute(errorRouteData);
      try {
        const newRenderContext = await this.#createRenderContext(
          url,
          request,
          errorRouteData,
          mod,
          status
        );
        const page = await mod.page();
        if (skipMiddleware === false) {
          this.#pipeline.setMiddlewareFunction(this.#manifest.middleware);
        }
        if (skipMiddleware) {
          this.#pipeline.unsetMiddlewareFunction();
        }
        const response2 = await this.#pipeline.renderRoute(newRenderContext, page);
        return this.#mergeResponses(response2, originalResponse);
      } catch {
        if (skipMiddleware === false) {
          return this.#renderError(request, {
            status,
            response: originalResponse,
            skipMiddleware: true
          });
        }
      }
    }
    const response = this.#mergeResponses(new Response(null, { status }), originalResponse);
    Reflect.set(response, responseSentSymbol, true);
    return response;
  }
  #mergeResponses(newResponse, originalResponse, override) {
    if (!originalResponse) {
      if (override !== void 0) {
        return new Response(newResponse.body, {
          status: override.status,
          statusText: newResponse.statusText,
          headers: newResponse.headers
        });
      }
      return newResponse;
    }
    const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
    try {
      originalResponse.headers.delete("Content-type");
    } catch {
    }
    return new Response(newResponse.body, {
      status,
      statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
      // If you're looking at here for possible bugs, it means that it's not a bug.
      // With the middleware, users can meddle with headers, and we should pass to the 404/500.
      // If users see something weird, it's because they are setting some headers they should not.
      //
      // Although, we don't want it to replace the content-type, because the error page must return `text/html`
      headers: new Headers([
        ...Array.from(newResponse.headers),
        ...Array.from(originalResponse.headers)
      ])
    });
  }
  #getDefaultStatusCode(routeData, pathname) {
    if (!routeData.pattern.exec(pathname)) {
      for (const fallbackRoute of routeData.fallbackRoutes) {
        if (fallbackRoute.pattern.test(pathname)) {
          return 302;
        }
      }
    }
    const route = removeTrailingForwardSlash(routeData.route);
    if (route.endsWith("/404"))
      return 404;
    if (route.endsWith("/500"))
      return 500;
    return 200;
  }
  async #getModuleForRoute(route) {
    if (route.type === "redirect") {
      return RedirectSinglePageBuiltModule;
    } else {
      if (this.#manifest.pageMap) {
        const importComponentInstance = this.#manifest.pageMap.get(route.component);
        if (!importComponentInstance) {
          throw new Error(
            `Unexpectedly unable to find a component instance for route ${route.route}`
          );
        }
        const pageModule = await importComponentInstance();
        return pageModule;
      } else if (this.#manifest.pageModule) {
        const importComponentInstance = this.#manifest.pageModule;
        return importComponentInstance;
      } else {
        throw new Error(
          "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
        );
      }
    }
  }
}
export {
  App,
  deserializeManifest
};
