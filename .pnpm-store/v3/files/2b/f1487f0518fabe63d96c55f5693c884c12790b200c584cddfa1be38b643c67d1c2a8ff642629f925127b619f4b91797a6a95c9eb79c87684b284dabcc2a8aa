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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const rules_1 = require("./utils/rules");
const processors = __importStar(require("./processor"));
const environments_1 = require("./environments");
const base_1 = __importDefault(require("./configs/base"));
const recommended_1 = __importDefault(require("./configs/recommended"));
const all_1 = __importDefault(require("./configs/all"));
const a11y_1 = require("./a11y");
const meta = __importStar(require("./meta"));
const configs = Object.assign({ base: base_1.default,
    recommended: recommended_1.default,
    all: all_1.default }, (0, a11y_1.buildA11yConfigs)());
const a11yConfigs = (0, a11y_1.buildA11yConfigs)();
for (const configName of Object.keys(a11yConfigs)) {
    Object.defineProperty(configs, configName, {
        enumerable: true,
        get() {
            return a11yConfigs[configName];
        },
    });
}
const rules = rules_1.rules.reduce((obj, r) => {
    obj[r.meta.docs.ruleName] = r;
    return obj;
}, {});
module.exports = {
    meta,
    configs,
    rules,
    processors: {
        ".astro": processors.astroProcessor,
        astro: processors.astroProcessor,
        "client-side-ts": processors.clientSideTsProcessor,
    },
    environments: environments_1.environments,
};
