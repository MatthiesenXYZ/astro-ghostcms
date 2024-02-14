"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("@volar/language-server/node");
const languageServerPlugin_js_1 = require("./languageServerPlugin.js");
const connection = (0, node_1.createConnection)();
const server = (0, node_1.createServer)(connection);
connection.listen();
connection.onInitialize((params) => {
    return server.initialize(params, node_1.createTypeScriptProjectProvider, (0, languageServerPlugin_js_1.createServerOptions)(connection, server));
});
connection.onInitialized(() => {
    server.initialized();
});
//# sourceMappingURL=nodeServer.js.map