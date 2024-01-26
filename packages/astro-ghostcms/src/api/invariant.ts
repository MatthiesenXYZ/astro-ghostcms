const isProduction: boolean = process.env.NODE_ENV === 'production';
const prefix: string = 'Invariant failed';

/** Throw an error if the condition is false
 * @example 
 * import { invariant } from '@matthiesenxyz/astro-ghostcms/api';
 * invariant(var, "var is false but its not supposed to be!")
 */
export function invariant(
  // biome-ignore lint/suspicious/noExplicitAny: we know what we are doing
condition: any,
  message?: string | (() => string),
): asserts condition {
  if (condition) {
    return;
  }
  if (isProduction) {
    throw new Error(prefix);
  }

  const provided: string | undefined = typeof message === 'function' ? message() : message;

  const value: string = provided ? `${prefix}: ${provided}` : prefix;
  throw new Error(value);
}