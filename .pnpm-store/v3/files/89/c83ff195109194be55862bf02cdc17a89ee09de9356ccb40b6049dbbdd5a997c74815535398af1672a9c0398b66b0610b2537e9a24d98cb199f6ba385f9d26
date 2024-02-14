"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentProvider = exports.LinkedCodeMapWithDocument = exports.SourceMapWithDocuments = void 0;
const language_core_1 = require("@volar/language-core");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
class SourceMapWithDocuments {
    constructor(sourceFileDocument, virtualFileDocument, map) {
        this.sourceFileDocument = sourceFileDocument;
        this.virtualFileDocument = virtualFileDocument;
        this.map = map;
    }
    // Range APIs
    getSourceRange(range, filter = () => true) {
        for (const result of this.getSourceRanges(range, filter)) {
            return result;
        }
    }
    getGeneratedRange(range, filter = () => true) {
        for (const result of this.getGeneratedRanges(range, filter)) {
            return result;
        }
    }
    *getSourceRanges(range, filter = () => true) {
        for (const result of this.findRanges(range, filter, 'getSourcePositionsBase', 'matchSourcePosition')) {
            yield result;
        }
    }
    *getGeneratedRanges(range, filter = () => true) {
        for (const result of this.findRanges(range, filter, 'getGeneratedPositionsBase', 'matchGeneratedPosition')) {
            yield result;
        }
    }
    *findRanges(range, filter, api, api2) {
        const failedLookUps = [];
        for (const mapped of this[api](range.start, filter)) {
            const end = this[api2](range.end, mapped[1]);
            if (end) {
                yield { start: mapped[0], end };
            }
            else {
                failedLookUps.push(mapped);
            }
        }
        for (const failedLookUp of failedLookUps) {
            for (const mapped of this[api](range.end, filter)) {
                yield { start: failedLookUp[0], end: mapped[0] };
            }
        }
    }
    // Position APIs
    getSourcePosition(position, filter = () => true) {
        for (const mapped of this.getSourcePositions(position, filter)) {
            return mapped;
        }
    }
    getGeneratedPosition(position, filter = () => true) {
        for (const mapped of this.getGeneratedPositions(position, filter)) {
            return mapped;
        }
    }
    *getSourcePositions(position, filter = () => true) {
        for (const mapped of this.getSourcePositionsBase(position, filter)) {
            yield mapped[0];
        }
    }
    *getGeneratedPositions(position, filter = () => true) {
        for (const mapped of this.getGeneratedPositionsBase(position, filter)) {
            yield mapped[0];
        }
    }
    *getSourcePositionsBase(position, filter = () => true) {
        for (const mapped of this.findPositions(position, filter, this.virtualFileDocument, this.sourceFileDocument, 'generatedOffsets', 'sourceOffsets')) {
            yield mapped;
        }
    }
    *getGeneratedPositionsBase(position, filter = () => true) {
        for (const mapped of this.findPositions(position, filter, this.sourceFileDocument, this.virtualFileDocument, 'sourceOffsets', 'generatedOffsets')) {
            yield mapped;
        }
    }
    *findPositions(position, filter, fromDoc, toDoc, from, to) {
        for (const mapped of this.map.findMatching(fromDoc.offsetAt(position), from, to)) {
            if (!filter(mapped[1].data)) {
                continue;
            }
            yield [toDoc.positionAt(mapped[0]), mapped[1]];
        }
    }
    matchSourcePosition(position, mapping) {
        let offset = (0, language_core_1.translateOffset)(this.virtualFileDocument.offsetAt(position), mapping.generatedOffsets, mapping.sourceOffsets, mapping.lengths);
        if (offset !== undefined) {
            return this.sourceFileDocument.positionAt(offset);
        }
    }
    matchGeneratedPosition(position, mapping) {
        let offset = (0, language_core_1.translateOffset)(this.sourceFileDocument.offsetAt(position), mapping.sourceOffsets, mapping.generatedOffsets, mapping.lengths);
        if (offset !== undefined) {
            return this.virtualFileDocument.positionAt(offset);
        }
    }
}
exports.SourceMapWithDocuments = SourceMapWithDocuments;
class LinkedCodeMapWithDocument extends SourceMapWithDocuments {
    constructor(document, linkedMap) {
        super(document, document, linkedMap);
        this.document = document;
        this.linkedMap = linkedMap;
    }
    *getLinkedCodePositions(posotion) {
        for (const linkedPosition of this.linkedMap.getLinkedOffsets(this.document.offsetAt(posotion))) {
            yield this.document.positionAt(linkedPosition);
        }
    }
}
exports.LinkedCodeMapWithDocument = LinkedCodeMapWithDocument;
function createDocumentProvider(files) {
    let version = 0;
    const map2DocMap = new WeakMap();
    const mirrorMap2DocMirrorMap = new WeakMap();
    const snapshot2Doc = new WeakMap();
    return {
        get,
        *getMaps(virtualCode) {
            for (const [sourceFileUri, [sourceSnapshot, map]] of files.getMaps(virtualCode)) {
                if (!map2DocMap.has(map)) {
                    map2DocMap.set(map, new SourceMapWithDocuments(get(sourceFileUri, files.get(sourceFileUri).languageId, sourceSnapshot), get(this.getVirtualCodeUri(sourceFileUri, virtualCode.id), virtualCode.languageId, virtualCode.snapshot), map));
                }
                yield map2DocMap.get(map);
            }
        },
        getLinkedCodeMap(virtualCode) {
            const map = files.getLinkedCodeMap(virtualCode);
            if (map) {
                if (!mirrorMap2DocMirrorMap.has(map)) {
                    mirrorMap2DocMirrorMap.set(map, new LinkedCodeMapWithDocument(get(this.getVirtualCodeUri(files.getByVirtualCode(virtualCode).id, virtualCode.id), virtualCode.languageId, virtualCode.snapshot), map));
                }
                return mirrorMap2DocMirrorMap.get(map);
            }
        },
        // TODO: rename to getVirtualCodeByDocumentUri
        getVirtualCodeByUri(uri) {
            if (uri.includes('?virtualCodeId=')) {
                const sourceFileUri = uri.split('?virtualCodeId=')[0];
                const virtualCodeId = uri.split('?virtualCodeId=')[1];
                return files.getVirtualCode(sourceFileUri, virtualCodeId);
            }
            return [undefined, undefined];
        },
        // TODO: rename to getDocumentUriByVirtualCode
        getVirtualCodeUri(sourceFileUri, virtualCodeId) {
            return sourceFileUri + `?virtualCodeId=${virtualCodeId}`;
        },
    };
    function get(uri, languageId, snapshot) {
        if (!snapshot2Doc.has(snapshot)) {
            snapshot2Doc.set(snapshot, new Map());
        }
        const map = snapshot2Doc.get(snapshot);
        if (!map.has(uri)) {
            map.set(uri, vscode_languageserver_textdocument_1.TextDocument.create(uri, languageId, version++, snapshot.getText(0, snapshot.getLength())));
        }
        return map.get(uri);
    }
}
exports.createDocumentProvider = createDocumentProvider;
//# sourceMappingURL=documents.js.map