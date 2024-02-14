"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerOptions = void 0;
const node_1 = require("@volar/language-server/node");
const core_1 = require("./core");
const svelte_js_1 = require("./core/svelte.js");
const vue_js_1 = require("./core/vue.js");
const importPackage_js_1 = require("./importPackage.js");
const utils_js_1 = require("./utils.js");
// Services
const volar_service_css_1 = require("volar-service-css");
const volar_service_emmet_1 = require("volar-service-emmet");
const volar_service_prettier_1 = require("volar-service-prettier");
const volar_service_typescript_twoslash_queries_1 = require("volar-service-typescript-twoslash-queries");
const astro_js_1 = require("./plugins/astro.js");
const html_js_1 = require("./plugins/html.js");
const index_js_1 = require("./plugins/typescript-addons/index.js");
const index_js_2 = require("./plugins/typescript/index.js");
function createServerOptions(connection, server) {
    return {
        watchFileExtensions: [
            'js',
            'cjs',
            'mjs',
            'ts',
            'cts',
            'mts',
            'jsx',
            'tsx',
            'json',
            'astro',
            'vue',
            'svelte',
        ],
        getServicePlugins() {
            const ts = getTypeScriptModule();
            return [
                (0, html_js_1.create)(),
                (0, volar_service_css_1.create)(),
                (0, volar_service_emmet_1.create)(),
                (0, index_js_2.create)(ts),
                (0, volar_service_typescript_twoslash_queries_1.create)(),
                (0, index_js_1.create)(),
                (0, astro_js_1.create)(ts),
                getPrettierService(),
            ];
        },
        getLanguagePlugins(serviceEnv, projectContext) {
            const ts = getTypeScriptModule();
            const languagePlugins = [
                (0, vue_js_1.getVueLanguageModule)(),
                (0, svelte_js_1.getSvelteLanguageModule)(),
            ];
            if (projectContext.typescript) {
                const rootPath = projectContext.typescript.configFileName
                    ? projectContext.typescript.configFileName.split('/').slice(0, -1).join('/')
                    : serviceEnv.typescript.uriToFileName(serviceEnv.workspaceFolder);
                const nearestPackageJson = server.modules.typescript?.findConfigFile(rootPath, ts.sys.fileExists, 'package.json');
                const astroInstall = (0, utils_js_1.getAstroInstall)([rootPath], {
                    nearestPackageJson: nearestPackageJson,
                    readDirectory: ts.sys.readDirectory,
                });
                if (astroInstall === 'not-found') {
                    connection.sendNotification(node_1.ShowMessageNotification.type, {
                        message: `Couldn't find Astro in workspace "${rootPath}". Experience might be degraded. For the best experience, please make sure Astro is installed into your project and restart the language server.`,
                        type: node_1.MessageType.Warning,
                    });
                }
                languagePlugins.unshift((0, core_1.getLanguageModule)(typeof astroInstall === 'string' ? undefined : astroInstall, ts));
            }
            return languagePlugins;
        },
    };
    function getTypeScriptModule() {
        const tsModule = server.modules.typescript;
        if (!tsModule) {
            throw new Error('TypeScript module is missing');
        }
        return tsModule;
    }
    function getPrettierService() {
        let prettier;
        let prettierPluginPath;
        return (0, volar_service_prettier_1.create)({
            getPrettier(env) {
                const workspacePath = env.typescript.uriToFileName(env.workspaceFolder);
                prettier = (0, importPackage_js_1.importPrettier)(workspacePath);
                prettierPluginPath = (0, importPackage_js_1.getPrettierPluginPath)(workspacePath);
                if (!prettier || !prettierPluginPath) {
                    connection.sendNotification(node_1.ShowMessageNotification.type, {
                        message: "Couldn't load `prettier` or `prettier-plugin-astro`. Formatting will not work. Please make sure those two packages are installed into your project.",
                        type: node_1.MessageType.Warning,
                    });
                }
                return prettier;
            },
            languages: ['astro'],
            ignoreIdeOptions: true,
            useIdeOptionsFallback: true,
            resolveConfigOptions: {
                // This seems to be broken since Prettier 3, and it'll always use its cumbersome cache. Hopefully it works one day.
                useCache: false,
            },
            additionalOptions: async (resolvedConfig) => {
                async function getAstroPrettierPlugin() {
                    if (!prettier || !prettierPluginPath) {
                        return [];
                    }
                    const hasPluginLoadedAlready = (await prettier.getSupportInfo()).languages.some((l) => l.name === 'astro') ||
                        resolvedConfig.plugins?.includes('prettier-plugin-astro'); // getSupportInfo doesn't seems to work very well in Prettier 3 for plugins
                    return hasPluginLoadedAlready ? [] : [prettierPluginPath];
                }
                const plugins = [...(await getAstroPrettierPlugin()), ...(resolvedConfig.plugins ?? [])];
                return {
                    ...resolvedConfig,
                    plugins: plugins,
                    parser: 'astro',
                };
            },
        });
    }
}
exports.createServerOptions = createServerOptions;
//# sourceMappingURL=languageServerPlugin.js.map