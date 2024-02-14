import path from "node:path";
import { appendForwardSlash } from "@astrojs/internal-helpers/path";
async function handleHotUpdate(ctx, { logger, compile, astroFileToCssAstroDeps, astroFileToCompileMetadata }) {
  const oldCode = astroFileToCompileMetadata.get(ctx.file)?.originalCode;
  const newCode = await ctx.read();
  if (oldCode && isStyleOnlyChanged(oldCode, newCode)) {
    logger.debug("watch", "style-only change");
    await compile(newCode, ctx.file);
    return ctx.modules.filter((mod) => mod.id?.includes("astro&type=style"));
  }
  for (const [astroFile, cssAstroDeps] of astroFileToCssAstroDeps) {
    if (cssAstroDeps.has(ctx.file)) {
      logger.info("watch", getShortName(ctx.file, ctx.server.config.root));
      const parentModules = ctx.server.moduleGraph.getModulesByFile(astroFile);
      if (parentModules) {
        for (const mod of parentModules) {
          ctx.server.moduleGraph.invalidateModule(mod);
        }
      }
      ctx.server.ws.send({ type: "full-reload", path: "*" });
    }
  }
}
const frontmatterRE = /^\-\-\-.*?^\-\-\-/ms;
const scriptRE = /<script(?:\s.*?)?>.*?<\/script>/gs;
const styleRE = /<style(?:\s.*?)?>.*?<\/style>/gs;
function isStyleOnlyChanged(oldCode, newCode) {
  if (oldCode === newCode)
    return false;
  let oldFrontmatter = "";
  let newFrontmatter = "";
  oldCode = oldCode.replace(frontmatterRE, (m) => (oldFrontmatter = m, ""));
  newCode = newCode.replace(frontmatterRE, (m) => (newFrontmatter = m, ""));
  if (oldFrontmatter !== newFrontmatter)
    return false;
  const oldScripts = [];
  const newScripts = [];
  oldCode = oldCode.replace(scriptRE, (m) => (oldScripts.push(m), ""));
  newCode = newCode.replace(scriptRE, (m) => (newScripts.push(m), ""));
  if (!isArrayEqual(oldScripts, newScripts))
    return false;
  const oldStyles = [];
  const newStyles = [];
  oldCode.match(styleRE)?.forEach((m) => oldStyles.push(m));
  newCode.match(styleRE)?.forEach((m) => newStyles.push(m));
  return oldStyles.length === newStyles.length && !isArrayEqual(oldStyles, newStyles);
}
function isArrayEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
function getShortName(file, root) {
  return file.startsWith(appendForwardSlash(root)) ? path.posix.relative(root, file) : file;
}
export {
  handleHotUpdate
};
