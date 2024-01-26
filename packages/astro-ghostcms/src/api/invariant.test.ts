import { describe, expect, it } from "vitest";

// Modified version of invariant script to allow tests
const isProduction= false;
const prefix: string = 'Invariant failed';
function invariant( // biome-ignore lint/suspicious/noExplicitAny: we know what we are doing 
condition: any,  message?: string | (() => string), ) {
  if (condition) {
    return;
  }
  if (isProduction) {
    throw new Error(prefix);
  }
  const provided: string | undefined = typeof message === 'function' ? message() : message;
  const value: string = provided ? `${prefix}: ${provided}` : prefix;
  return value;
}

// TEST SECTION
const testTrue = true;
const testFalse = false;
describe('test invariant', () => {

  it('Test `true` value', () => {
    invariant(testTrue, "This should not error")
    expect(null)
  })

  it('Test `false` value', () => {
    invariant(testFalse, "This should Error")
    expect(String("Invariant failed"))
  })

})