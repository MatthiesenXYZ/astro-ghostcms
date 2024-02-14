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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startLanguageServer = exports.createConnection = void 0;
const vscode = require("vscode-languageserver/browser");
const server_1 = require("./lib/common/server");
const http_1 = require("./lib/common/schemaRequestHandlers/http");
const vscode_uri_1 = require("vscode-uri");
const protocol_1 = require("./protocol");
const language_service_1 = require("@volar/language-service");
__exportStar(require("./index"), exports);
function createConnection() {
    const messageReader = new vscode.BrowserMessageReader(self);
    const messageWriter = new vscode.BrowserMessageWriter(self);
    const connection = vscode.createConnection(messageReader, messageWriter);
    return connection;
}
exports.createConnection = createConnection;
function startLanguageServer(connection, ...plugins) {
    (0, server_1.startCommonLanguageServer)(connection, plugins, () => ({
        uriToFileName,
        fileNameToUri,
        console: connection.console,
        timer: {
            setImmediate(callback, ...args) {
                const handle = setTimeout(callback, 0, ...args);
                return { dispose: () => clearTimeout(handle) };
            },
        },
        async loadTypeScript(options) {
            const tsdkUrl = options.typescript && 'tsdkUrl' in options.typescript
                ? options.typescript.tsdkUrl
                : undefined;
            if (!tsdkUrl) {
                return;
            }
            const _module = globalThis.module;
            globalThis.module = { exports: {} };
            await import(`${tsdkUrl}/typescript.js`);
            const ts = globalThis.module.exports;
            globalThis.module = _module;
            return ts;
        },
        async loadTypeScriptLocalized(options, locale) {
            const tsdkUrl = options.typescript && 'tsdkUrl' in options.typescript
                ? options.typescript.tsdkUrl
                : undefined;
            if (!tsdkUrl) {
                return;
            }
            try {
                const json = await (0, http_1.default)(`${tsdkUrl}/${locale}/diagnosticMessages.generated.json`);
                if (json) {
                    return JSON.parse(json);
                }
            }
            catch { }
        },
        fs: {
            async stat(uri) {
                if (uri.startsWith('__invalid__:')) {
                    return;
                }
                if (uri.startsWith('http://') || uri.startsWith('https://')) { // perf
                    const text = await this.readFile(uri);
                    if (text !== undefined) {
                        return {
                            type: language_service_1.FileType.File,
                            size: text.length,
                            ctime: -1,
                            mtime: -1,
                        };
                    }
                    return undefined;
                }
                return await connection.sendRequest(protocol_1.FsStatRequest.type, uri);
            },
            async readFile(uri) {
                if (uri.startsWith('__invalid__:')) {
                    return;
                }
                if (uri.startsWith('http://') || uri.startsWith('https://')) { // perf
                    return await (0, http_1.default)(uri);
                }
                return await connection.sendRequest(protocol_1.FsReadFileRequest.type, uri) ?? undefined;
            },
            async readDirectory(uri) {
                if (uri.startsWith('__invalid__:')) {
                    return [];
                }
                if (uri.startsWith('http://') || uri.startsWith('https://')) { // perf
                    return [];
                }
                return await connection.sendRequest(protocol_1.FsReadDirectoryRequest.type, uri);
            },
        },
        getCancellationToken(original) {
            return original ?? vscode.CancellationToken.None;
        },
    }));
}
exports.startLanguageServer = startLanguageServer;
function uriToFileName(uri) {
    const parsed = vscode_uri_1.URI.parse(uri);
    if (parsed.scheme === '__invalid__') {
        return parsed.path;
    }
    return `/${parsed.scheme}${parsed.authority ? '@' + parsed.authority : ''}${parsed.path}`;
}
function fileNameToUri(fileName) {
    const parts = fileName.split('/');
    if (parts.length <= 1) {
        return vscode_uri_1.URI.from({
            scheme: '__invalid__',
            path: fileName,
        }).toString();
    }
    const firstParts = parts[1].split('@');
    return vscode_uri_1.URI.from({
        scheme: firstParts[0],
        authority: firstParts.length > 1 ? firstParts[1] : undefined,
        path: '/' + parts.slice(2).join('/'),
    }).toString();
}
//# sourceMappingURL=browser.js.map