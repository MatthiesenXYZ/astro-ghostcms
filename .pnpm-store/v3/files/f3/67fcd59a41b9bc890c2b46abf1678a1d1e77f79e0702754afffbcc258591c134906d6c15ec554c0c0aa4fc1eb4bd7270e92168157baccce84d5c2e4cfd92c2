"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processor = void 0;
const astro_eslint_parser_1 = require("astro-eslint-parser");
const shared_1 = require("../shared");
const meta = __importStar(require("../meta"));
exports.processor = {
    preprocess(code, filename) {
        if (filename) {
            const shared = (0, shared_1.beginShared)(filename);
            let parsed;
            try {
                parsed = (0, astro_eslint_parser_1.parseTemplate)(code);
            }
            catch (_a) {
                return [code];
            }
            parsed.walk(parsed.result.ast, (node) => {
                if (node.type === "element" &&
                    node.name === "script" &&
                    node.children.length &&
                    !node.attributes.some(({ name, value }) => name === "type" && /json$|importmap/i.test(value))) {
                    shared.addClientScript(code, node, parsed);
                }
            });
            return [code, ...shared.clientScripts.map((cs) => cs.getProcessorFile())];
        }
        return [code];
    },
    postprocess([messages, ...blockMessages], filename) {
        const shared = (0, shared_1.terminateShared)(filename);
        if (shared) {
            return messages.concat(...blockMessages.map((m, i) => shared.clientScripts[i].remapMessages(m)));
        }
        return messages;
    },
    supportsAutofix: true,
    meta,
};
