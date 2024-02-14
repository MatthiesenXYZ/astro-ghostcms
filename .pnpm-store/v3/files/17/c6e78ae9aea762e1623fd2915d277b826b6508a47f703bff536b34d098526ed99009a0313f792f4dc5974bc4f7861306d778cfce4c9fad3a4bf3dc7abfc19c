"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentRange = exports.loadModule = void 0;
const module_1 = __importDefault(require("module"));
const path_1 = __importDefault(require("path"));
const compat_1 = require("../compat");
const cache = new WeakMap();
function loadModule(context, name) {
    const sourceCode = (0, compat_1.getSourceCode)(context);
    const key = sourceCode.ast;
    let modules = cache.get(key);
    if (!modules) {
        modules = {};
        cache.set(key, modules);
    }
    const mod = modules[name];
    if (mod)
        return mod;
    try {
        const cwd = (0, compat_1.getCwd)(context);
        const relativeTo = path_1.default.join(cwd, "__placeholder__.js");
        return (modules[name] = module_1.default.createRequire(relativeTo)(name));
    }
    catch (_a) {
        return null;
    }
}
exports.loadModule = loadModule;
function getContentRange(node) {
    if (node.closingElement) {
        return [node.openingElement.range[1], node.closingElement.range[0]];
    }
    return [node.openingElement.range[1], node.range[1]];
}
exports.getContentRange = getContentRange;
