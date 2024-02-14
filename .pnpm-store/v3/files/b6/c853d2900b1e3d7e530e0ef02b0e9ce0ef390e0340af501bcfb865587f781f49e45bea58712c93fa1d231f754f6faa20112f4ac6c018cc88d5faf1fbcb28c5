import type { ComponentInstance, MiddlewareHandler } from '../@types/astro.js';
import { type Environment, type RenderContext } from './render/index.js';
export type PipelineHookFunction = (ctx: RenderContext, mod: ComponentInstance | undefined) => void;
/**
 * This is the basic class of a pipeline.
 *
 * Check the {@link ./README.md|README} for more information about the pipeline.
 */
export declare class Pipeline {
    #private;
    env: Environment;
    /**
     * When creating a pipeline, an environment is mandatory.
     * The environment won't change for the whole lifetime of the pipeline.
     */
    constructor(env: Environment);
    setEnvironment(): void;
    /**
     * A middleware function that will be called before each request.
     */
    setMiddlewareFunction(onRequest: MiddlewareHandler): void;
    /**
     * Removes the current middleware function. Subsequent requests won't trigger any middleware.
     */
    unsetMiddlewareFunction(): void;
    /**
     * Returns the current environment
     */
    getEnvironment(): Readonly<Environment>;
    /**
     * The main function of the pipeline. Use this function to render any route known to Astro;
     */
    renderRoute(renderContext: RenderContext, componentInstance: ComponentInstance | undefined): Promise<Response>;
    /**
     * Store a function that will be called before starting the rendering phase.
     * @param fn
     */
    onBeforeRenderRoute(fn: PipelineHookFunction): void;
}
