import { describe, expect, test } from "vitest";

import TS_API from "../../content-api";
import type { Post } from "./posts";

const url = process.env.VITE_GHOST_URL || "https://my-ghost-blog.com";
const key = process.env.VITE_GHOST_CONTENT_API_KEY || "59d4bf56c73c04a18c867dc3ba";

describe("posts api .browse() Args Type-safety", () => {
  const api = new TS_API(url, key, "v5.0");
  test(".browse() params shouldnt accept invalid params", () => {
    // @ts-expect-error - shouldnt accept invalid params
    const browse = api.posts.browse({ pp: 2 });
    expect(browse.getParams().browseParams).toStrictEqual({});

    const outputFields = {
      slug: true,
      title: true,
      // @ts-expect-error - shouldnt accept invalid params
      foo: true,
    } satisfies { [k in keyof Post]?: true | undefined };

    // biome-ignore lint/style/useConst: <explanation>
let  test = api.posts
      .browse()
      // @ts-expect-error - shouldnt accept invalid params
      .fields(outputFields);
    expect(test.getOutputFields()).toEqual(["slug", "title"]);

    const fields = ["slug", "title", "foo"] as const;
    const unknownOriginFields = fields.reduce((acc, k) => {
      acc[k as keyof Post] = true;
      return acc;
    }, {} as { [k in keyof Post]?: true | undefined });
    const result = api.posts.browse().fields(unknownOriginFields);
    expect(result.getOutputFields()).toEqual(["slug", "title"]);
  });
  test(".browse() params, output fields declare const", () => {
    const outputFields = {
      slug: true,
      title: true,
    } satisfies { [k in keyof Post]?: true | undefined };

    // biome-ignore lint/style/useConst: <explanation>
let  test = api.posts.browse().fields(outputFields);
    expect(test.getOutputFields()).toEqual(["slug", "title"]);

    // @ts-expect-error - shouldnt accept invalid params
    expect(() => api.posts.browse({ filter: "slugg:test" })).toThrow();
    // @ts-expect-error - shouldnt accept invalid params
    expect(() => api.posts.browse({ filter: "slug:test,foo:-[bar,baz]" })).toThrow();
    expect(api.posts.browse({ filter: "slug:test,tags:-[bar,baz]" })).toBeDefined();
    expect(api.posts.browse({ filter: "slug:test,tags:[bar,baz]" })).toBeDefined();
    // @ts-expect-error - shouldnt accept invalid params
    expect(() => api.posts.browse({ filter: "slug:test,food:-[bar,baz]" })).toThrow();
  });
});