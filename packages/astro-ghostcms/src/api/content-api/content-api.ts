import {
  APIComposer, BasicFetcher, contentAPICredentialsSchema,
  HTTPClient, slugOrIdSchema,
} from "@ts-ghost/core-api";

import { 
  authorsIncludeSchema, authorsSchema, pagesIncludeSchema, 
  pagesSchema, postsIncludeSchema, postsSchema, 
  settingsSchema, tagsIncludeSchema, tagsSchema, 
  tiersIncludeSchema, tiersSchema 
} from "./schemas";

export type { ContentAPICredentials, APIVersions } from "@ts-ghost/core-api";

export enum BrowseEndpointType {
  authors = "authors",
  tiers = "tiers",
  posts = "posts",
  pages = "pages",
  tags = "tags",
  settings = "settings",
}

export class TSGhostContentAPI<Version extends `v5.${// biome-ignore lint/suspicious/noExplicitAny: shhhhh
string}` = any> {
  private httpClient: HTTPClient;

  constructor(
    protected readonly url: string,
    protected readonly key: string,
    protected readonly version: Version
  ) {
    const apiCredentials = contentAPICredentialsSchema.parse({
      key,
      version,
      url,
    });
    this.httpClient = new HTTPClient({
      ...apiCredentials,
      endpoint: "content",
    });
  }

  get authors() {
    return new APIComposer(
      "authors",
      {
        schema: authorsSchema,
        identitySchema: slugOrIdSchema,
        include: authorsIncludeSchema,
      },
      this.httpClient
    ).access(["read", "browse"]);
  }
  get tiers() {
    return new APIComposer(
      "tiers",
      { schema: tiersSchema, identitySchema: slugOrIdSchema, include: tiersIncludeSchema },
      this.httpClient
    ).access(["browse", "read"]);
  }
  get posts() {
    return new APIComposer(
      "posts",
      {
        schema: postsSchema,
        identitySchema: slugOrIdSchema,
        include: postsIncludeSchema,
      },
      this.httpClient
    ).access(["browse", "read"]);
  }
  get pages() {
    return new APIComposer(
      "pages",
      {
        schema: pagesSchema,
        identitySchema: slugOrIdSchema,
        include: pagesIncludeSchema,
      },
      this.httpClient
    ).access(["browse", "read"]);
  }
  get tags() {
    return new APIComposer(
      "tags",
      { schema: tagsSchema, identitySchema: slugOrIdSchema, include: tagsIncludeSchema },
      this.httpClient
    ).access(["browse", "read"]);
  }

  get settings() {
    return new BasicFetcher("settings", { output: settingsSchema }, this.httpClient);
  }
}