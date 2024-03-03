declare module "virtual:@matthiesenxyz/astro-ghostcms/config" {
    const Config: import("./src/schemas/userconfig").GhostUserConfig;
    export default Config;
}