/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly CONTENT_API_KEY: string
  readonly CONTENT_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}