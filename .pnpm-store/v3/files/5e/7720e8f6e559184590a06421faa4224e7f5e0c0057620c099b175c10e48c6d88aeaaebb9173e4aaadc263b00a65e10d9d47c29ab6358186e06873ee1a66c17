"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayItemsEqual = exports.createLanguageServicePlugin = void 0;
const decorateLanguageService_1 = require("../node/decorateLanguageService");
const decorateLanguageServiceHost_1 = require("../node/decorateLanguageServiceHost");
const language_core_1 = require("@volar/language-core");
const externalFiles = new WeakMap();
const projectExternalFileExtensions = new WeakMap();
const decoratedLanguageServices = new WeakSet();
const decoratedLanguageServiceHosts = new WeakSet();
function createLanguageServicePlugin(loadLanguagePlugins) {
    return modules => {
        const { typescript: ts } = modules;
        const pluginModule = {
            create(info) {
                if (!decoratedLanguageServices.has(info.languageService)
                    && !decoratedLanguageServiceHosts.has(info.languageServiceHost)) {
                    decoratedLanguageServices.add(info.languageService);
                    decoratedLanguageServiceHosts.add(info.languageServiceHost);
                    const languagePlugins = loadLanguagePlugins(ts, info);
                    const extensions = languagePlugins
                        .map(plugin => plugin.typescript?.extraFileExtensions.map(ext => '.' + ext.extension) ?? [])
                        .flat();
                    projectExternalFileExtensions.set(info.project, extensions);
                    const getScriptSnapshot = info.languageServiceHost.getScriptSnapshot.bind(info.languageServiceHost);
                    const files = (0, language_core_1.createFileRegistry)(languagePlugins, ts.sys.useCaseSensitiveFileNames, fileName => {
                        const snapshot = getScriptSnapshot(fileName);
                        if (snapshot) {
                            files.set(fileName, (0, language_core_1.resolveCommonLanguageId)(fileName), snapshot);
                        }
                        else {
                            files.delete(fileName);
                        }
                    });
                    (0, decorateLanguageService_1.decorateLanguageService)(files, info.languageService);
                    (0, decorateLanguageServiceHost_1.decorateLanguageServiceHost)(files, info.languageServiceHost, ts);
                }
                return info.languageService;
            },
            getExternalFiles(project, updateLevel = 0) {
                if (updateLevel >= (1)
                    || !externalFiles.has(project)) {
                    const oldFiles = externalFiles.get(project);
                    const newFiles = (0, decorateLanguageServiceHost_1.searchExternalFiles)(ts, project, projectExternalFileExtensions.get(project));
                    externalFiles.set(project, newFiles);
                    if (oldFiles && !arrayItemsEqual(oldFiles, newFiles)) {
                        project.refreshDiagnostics();
                    }
                }
                return externalFiles.get(project);
            },
        };
        return pluginModule;
    };
}
exports.createLanguageServicePlugin = createLanguageServicePlugin;
function arrayItemsEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    const set = new Set(a);
    for (const file of b) {
        if (!set.has(file)) {
            return false;
        }
    }
    return true;
}
exports.arrayItemsEqual = arrayItemsEqual;
//# sourceMappingURL=createLanguageServicePlugin.js.map