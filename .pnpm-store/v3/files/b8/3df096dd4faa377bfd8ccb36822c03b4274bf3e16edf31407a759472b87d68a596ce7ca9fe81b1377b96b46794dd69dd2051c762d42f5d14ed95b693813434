interface Record {
    [property: string]: string;
}
interface Source {
    path: string;
    css?: Record;
    style: string;
    preload?: boolean;
    weight?: string | number;
}
interface Config {
    name: string;
    src: Source[];
    fetch?: boolean;
    display: string;
    verbose?: boolean;
    selector?: string;
    preload?: boolean;
    cacheDir?: string;
    basePath?: string;
    fallbackName?: string;
    googleFontsURL?: string;
    cssVariable?: string | boolean;
    fallback: 'serif' | 'sans-serif';
}
interface Props {
    config: Config[];
}
declare function getRelativePath(from: string, to: string): string;
declare function getPreloadType(src: string): string;
declare function generateFonts(fontCollection: Config[]): Promise<Config[]>;
declare function createPreloads(fontCollection: Config): string[];
declare function createBaseCSS(fontCollection: Config): Promise<string[]>;
declare function createFontCSS(fontCollection: Config): Promise<string>;

export { type Props, createBaseCSS, createFontCSS, createPreloads, generateFonts, getPreloadType, getRelativePath };
