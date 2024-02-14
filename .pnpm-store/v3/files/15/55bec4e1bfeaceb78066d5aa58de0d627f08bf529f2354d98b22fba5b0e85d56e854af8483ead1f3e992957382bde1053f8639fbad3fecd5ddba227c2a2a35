import * as _unocss_core from '@unocss/core';
import { Preflight, PresetOptions, Postprocessor } from '@unocss/core';
import { T as Theme } from './shared/preset-mini.7XoWRZIl.mjs';
export { a as ThemeAnimation } from './shared/preset-mini.7XoWRZIl.mjs';
export { t as theme } from './shared/preset-mini.4DxDu2I8.mjs';
export { colors } from './colors.mjs';
export { p as parseColor } from './shared/preset-mini.XmVozI6N.mjs';

declare const preflights: Preflight<Theme>[];

interface DarkModeSelectors {
    /**
     * Selector for light variant.
     *
     * @default '.light'
     */
    light?: string;
    /**
     * Selector for dark variant.
     *
     * @default '.dark'
     */
    dark?: string;
}
interface PresetMiniOptions extends PresetOptions {
    /**
     * Dark mode options
     *
     * @default 'class'
     */
    dark?: 'class' | 'media' | DarkModeSelectors;
    /**
     * Generate pseudo selector as `[group=""]` instead of `.group`
     *
     * @default false
     */
    attributifyPseudo?: boolean;
    /**
     * Prefix for CSS variables.
     *
     * @default 'un-'
     */
    variablePrefix?: string;
    /**
     * Utils prefix
     *
     * @default undefined
     */
    prefix?: string | string[];
    /**
     * Generate preflight
     *
     * @default true
     */
    preflight?: boolean;
    /**
     * Enable arbitrary variants, for example `<div class="[&>*]:m-1 [&[open]]:p-2"></div>`.
     *
     * Disable this might slightly improve the performance.
     *
     * @default true
     */
    arbitraryVariants?: boolean;
}
declare const presetMini: _unocss_core.PresetFactory<Theme, PresetMiniOptions>;

declare function VarPrefixPostprocessor(prefix: string): Postprocessor | undefined;
declare function normalizePreflights<Theme extends object>(preflights: Preflight<Theme>[], variablePrefix: string): Preflight<Theme>[];

export { type DarkModeSelectors, type PresetMiniOptions, Theme, VarPrefixPostprocessor, presetMini as default, normalizePreflights, preflights, presetMini };
