"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
const postcss_1 = __importDefault(require("postcss"));
const utils_1 = require("./utils");
const compat_1 = require("../compat");
function transform(node, context) {
    var _a;
    const postcssLoadConfig = loadPostcssLoadConfig(context);
    if (!postcssLoadConfig) {
        return null;
    }
    const inputRange = (0, utils_1.getContentRange)(node);
    const sourceCode = (0, compat_1.getSourceCode)(context);
    const code = sourceCode.text.slice(...inputRange);
    const filename = `${(0, compat_1.getFilename)(context)}.css`;
    try {
        const config = postcssLoadConfig.sync({
            cwd: (_a = (0, compat_1.getCwd)(context)) !== null && _a !== void 0 ? _a : process.cwd(),
            from: filename,
        });
        const result = (0, postcss_1.default)(config.plugins).process(code, Object.assign(Object.assign({}, config.options), { map: {
                inline: false,
            } }));
        return {
            inputRange,
            output: result.content,
            mappings: result.map.toJSON().mappings,
        };
    }
    catch (_e) {
        return null;
    }
}
exports.transform = transform;
function loadPostcssLoadConfig(context) {
    return (0, utils_1.loadModule)(context, "postcss-load-config");
}
