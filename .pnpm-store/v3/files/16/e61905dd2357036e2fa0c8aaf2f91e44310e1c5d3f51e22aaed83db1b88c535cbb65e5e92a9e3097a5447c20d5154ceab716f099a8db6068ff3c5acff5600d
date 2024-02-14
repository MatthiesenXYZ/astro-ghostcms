import { bold } from "kleur/colors";
import { REROUTE_DIRECTIVE_HEADER } from "./consts.js";
async function renderEndpoint(mod, context, ssr, logger) {
  const { request, url } = context;
  const method = request.method.toUpperCase();
  const handler = mod[method] ?? mod["ALL"];
  if (!ssr && ssr === false && method !== "GET") {
    logger.warn(
      "router",
      `${url.pathname} ${bold(
        method
      )} requests are not available for a static site. Update your config to \`output: 'server'\` or \`output: 'hybrid'\` to enable.`
    );
  }
  if (typeof handler !== "function") {
    logger.warn(
      "router",
      `No API Route handler exists for the method "${method}" for the route ${url.pathname}.
Found handlers: ${Object.keys(mod).map((exp) => JSON.stringify(exp)).join(", ")}
` + ("all" in mod ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?
` : "")
    );
    return new Response(null, { status: 404 });
  }
  const response = await handler.call(mod, context);
  if (response.status === 404 || response.status === 500) {
    response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
  }
  return response;
}
export {
  renderEndpoint
};
