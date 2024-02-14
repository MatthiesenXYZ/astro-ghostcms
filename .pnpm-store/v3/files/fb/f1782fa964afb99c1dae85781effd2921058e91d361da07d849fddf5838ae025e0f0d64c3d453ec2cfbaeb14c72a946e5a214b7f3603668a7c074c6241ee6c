import { resolve as importMetaResolve } from "import-meta-resolve";
import path from "node:path";
import { pathToFileURL } from "node:url";
let cwdUrlStr;
async function importPlugin(p) {
  try {
    const importResult2 = await import(p);
    return importResult2.default;
  } catch {
  }
  cwdUrlStr ??= pathToFileURL(path.join(process.cwd(), "package.json")).toString();
  const resolved = importMetaResolve(p, cwdUrlStr);
  const importResult = await import(resolved);
  return importResult.default;
}
export {
  importPlugin
};
