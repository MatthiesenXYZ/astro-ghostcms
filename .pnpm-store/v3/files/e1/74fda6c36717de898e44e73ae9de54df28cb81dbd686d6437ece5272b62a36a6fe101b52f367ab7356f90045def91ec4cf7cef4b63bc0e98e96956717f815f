import type { URI } from 'vscode-uri';
export type WorkspaceFolderManager = ReturnType<typeof createWorkspaceFolderManager>;
export declare function createWorkspaceFolderManager(): {
    add(folder: URI): void;
    remove(folder: URI): void;
    getAll(): URI[];
    onDidAdd(cb: (folder: URI) => void): {
        dispose(): void;
    };
    onDidRemove(cb: (folder: URI) => void): {
        dispose(): void;
    };
};
