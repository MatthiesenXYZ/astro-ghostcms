import { transform } from 'ultrahtml';
import { jsx as h } from 'astro/jsx-runtime';
import { renderJSX } from 'astro/runtime/server/jsx';
import { __unsafeHTML } from 'ultrahtml';
import * as entities from "entities";
import swap from 'ultrahtml/transformers/swap'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export  function createComponentProxy(result, _components: Record<string, any> = {}) {
  const components = {};
  for (const [key, value] of Object.entries(_components)) {
    if (typeof value === 'string') {
      components[key] = value;
    } else {
      components[key] = async (props, children) => {
        if (key === 'CodeBlock' || key === 'CodeSpan') {
          props.code = entities.decode(JSON.parse(`"${props.code}"`));
        }
        const output = await renderJSX(
          result,
          h(value, { ...props, 'set:html': children.value })
        );
        return __unsafeHTML(output);
      };
    }
  }
  return components;
}

function getIndent(ln: string): string {
  if (ln.trim() === ln) return '';
  return ln.slice(0, ln.length - ln.trim().length);
}

export function dedent(str: string): string {
  const lns = str.replace(/^[\r\n]+/, '').split('\n');
  let indent = getIndent(lns[0]);
  if (indent.length === 0 && lns.length > 1) {
    indent = getIndent(lns[1]);
  }
  return lns
    .map((ln) => (ln.startsWith(indent) ? ln.slice(indent.length) : ln))
    .map((ln, i, { length }) => (i === length - 1 ? ln.trim() : ln))
    .join('\n');
}

export interface HTMLOptions {
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
components?: {};
}

export async function html(
  input: string,
  opts: HTMLOptions = {}
): Promise<string> {
  return transform(dedent(input), [
    swap(opts.components),
  ],)
}
