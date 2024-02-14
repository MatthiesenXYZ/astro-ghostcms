import { normalizePath } from "vite";
import { normalizeFilename } from "../vite-plugin-utils/index.js";
import { compileAstro } from "./compile.js";
import { handleHotUpdate } from "./hmr.js";
import { parseAstroRequest } from "./query.js";
import { getAstroMetadata } from "./metadata.js";
const astroFileToCompileMetadataWeakMap = /* @__PURE__ */ new WeakMap();
function astro({ settings, logger }) {
  const { config } = settings;
  let server;
  let compile;
  let astroFileToCssAstroDeps = /* @__PURE__ */ new Map();
  let astroFileToCompileMetadata = /* @__PURE__ */ new Map();
  const srcRootWeb = config.srcDir.pathname.slice(config.root.pathname.length - 1);
  const isBrowserPath = (path) => path.startsWith(srcRootWeb) && srcRootWeb !== "/";
  const prePlugin = {
    name: "astro:build",
    enforce: "pre",
    // run transforms before other plugins can
    configResolved(viteConfig) {
      compile = (code, filename) => {
        return compileAstro({
          compileProps: {
            astroConfig: config,
            viteConfig,
            preferences: settings.preferences,
            filename,
            source: code
          },
          astroFileToCompileMetadata,
          logger
        });
      };
    },
    configureServer(_server) {
      server = _server;
      server.watcher.on("unlink", (filename) => {
        astroFileToCompileMetadata.delete(filename);
      });
    },
    buildStart() {
      astroFileToCssAstroDeps = /* @__PURE__ */ new Map();
      astroFileToCompileMetadata = /* @__PURE__ */ new Map();
      if (astroFileToCompileMetadataWeakMap.has(config)) {
        astroFileToCompileMetadata = astroFileToCompileMetadataWeakMap.get(config);
      } else {
        astroFileToCompileMetadataWeakMap.set(config, astroFileToCompileMetadata);
      }
    },
    async load(id, opts) {
      const parsedId = parseAstroRequest(id);
      const query = parsedId.query;
      if (!query.astro) {
        return null;
      }
      const filename = normalizePath(normalizeFilename(parsedId.filename, config.root));
      const compileMetadata = astroFileToCompileMetadata.get(filename);
      if (!compileMetadata) {
        throw new Error(
          `No cached compile metadata found for "${id}". The main Astro module "${filename}" should have compiled and filled the metadata first, before its virtual modules can be requested.`
        );
      }
      switch (query.type) {
        case "style": {
          if (typeof query.index === "undefined") {
            throw new Error(`Requests for Astro CSS must include an index.`);
          }
          const code = compileMetadata.css[query.index];
          if (!code) {
            throw new Error(`No Astro CSS at index ${query.index}`);
          }
          return { code };
        }
        case "script": {
          if (typeof query.index === "undefined") {
            throw new Error(`Requests for hoisted scripts must include an index`);
          }
          if (opts?.ssr) {
            return {
              code: `/* client hoisted script, empty in SSR: ${id} */`
            };
          }
          const hoistedScript = compileMetadata.scripts[query.index];
          if (!hoistedScript) {
            throw new Error(`No hoisted script at index ${query.index}`);
          }
          if (hoistedScript.type === "external") {
            const src = hoistedScript.src;
            if (src.startsWith("/") && !isBrowserPath(src)) {
              const publicDir = config.publicDir.pathname.replace(/\/$/, "").split("/").pop() + "/";
              throw new Error(
                `

<script src="${src}"> references an asset in the "${publicDir}" directory. Please add the "is:inline" directive to keep this asset from being bundled.

File: ${id}`
              );
            }
          }
          const result = {
            code: "",
            meta: {
              vite: {
                lang: "ts"
              }
            }
          };
          switch (hoistedScript.type) {
            case "inline": {
              const { code, map } = hoistedScript;
              result.code = appendSourceMap(code, map);
              break;
            }
            case "external": {
              const { src } = hoistedScript;
              result.code = `import "${src}"`;
              break;
            }
          }
          return result;
        }
        default:
          return null;
      }
    },
    async transform(source, id) {
      const parsedId = parseAstroRequest(id);
      if (!id.endsWith(".astro") || parsedId.query.astro) {
        return;
      }
      const filename = normalizePath(parsedId.filename);
      const transformResult = await compile(source, filename);
      const astroDeps = /* @__PURE__ */ new Set();
      for (const dep of transformResult.cssDeps) {
        if (dep.endsWith(".astro")) {
          astroDeps.add(dep);
        }
        this.addWatchFile(dep);
      }
      astroFileToCssAstroDeps.set(id, astroDeps);
      if (server) {
        const mods = server.moduleGraph.getModulesByFile(filename);
        if (mods) {
          const seen = new Set(mods);
          for (const mod of mods) {
            if (mod.url.includes("?astro")) {
              server.moduleGraph.invalidateModule(mod, seen);
            }
          }
        }
      }
      const astroMetadata = {
        clientOnlyComponents: transformResult.clientOnlyComponents,
        hydratedComponents: transformResult.hydratedComponents,
        scripts: transformResult.scripts,
        containsHead: transformResult.containsHead,
        propagation: transformResult.propagation ? "self" : "none",
        pageOptions: {}
      };
      return {
        code: transformResult.code,
        map: transformResult.map,
        meta: {
          astro: astroMetadata,
          vite: {
            // Setting this vite metadata to `ts` causes Vite to resolve .js
            // extensions to .ts files.
            lang: "ts"
          }
        }
      };
    },
    async handleHotUpdate(ctx) {
      if (!ctx.file.endsWith(".astro"))
        return;
      return handleHotUpdate(ctx, {
        logger,
        compile,
        astroFileToCssAstroDeps,
        astroFileToCompileMetadata
      });
    }
  };
  const normalPlugin = {
    name: "astro:build:normal",
    resolveId(id) {
      const parsedId = parseAstroRequest(id);
      if (parsedId.query.astro) {
        return id;
      }
    }
  };
  return [prePlugin, normalPlugin];
}
function appendSourceMap(content, map) {
  if (!map)
    return content;
  return `${content}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(
    map
  ).toString("base64")}`;
}
export {
  astro as default,
  getAstroMetadata
};
