"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkspaceFolderManager = void 0;
function createWorkspaceFolderManager() {
    let folders = [];
    const onDidAddCallbacks = new Set();
    const onDidRemoveCallbacks = new Set();
    return {
        add(folder) {
            if (!folders.some(uri => uri.toString() === folder.toString())) {
                folders.push(folder);
            }
        },
        remove(folder) {
            folders = folders.filter(uri => uri.toString() !== folder.toString());
        },
        getAll() {
            return folders;
        },
        onDidAdd(cb) {
            onDidAddCallbacks.add(cb);
            return {
                dispose() {
                    onDidAddCallbacks.delete(cb);
                },
            };
        },
        onDidRemove(cb) {
            onDidRemoveCallbacks.add(cb);
            return {
                dispose() {
                    onDidRemoveCallbacks.delete(cb);
                },
            };
        },
    };
}
exports.createWorkspaceFolderManager = createWorkspaceFolderManager;
//# sourceMappingURL=workspaceFolderManager.js.map