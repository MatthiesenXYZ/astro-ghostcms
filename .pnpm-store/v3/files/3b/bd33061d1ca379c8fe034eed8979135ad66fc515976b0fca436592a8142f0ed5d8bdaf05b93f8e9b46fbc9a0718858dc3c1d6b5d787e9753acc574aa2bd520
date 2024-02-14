import { telemetry } from "../events/index.js";
import { eventAppToggled } from "../events/toolbar.js";
const VIRTUAL_MODULE_ID = "astro:dev-toolbar";
const resolvedVirtualModuleId = "\0" + VIRTUAL_MODULE_ID;
function astroDevToolbar({ settings, logger }) {
  let telemetryTimeout;
  return {
    name: "astro:dev-toolbar",
    config() {
      return {
        optimizeDeps: {
          // Optimize CJS dependencies used by the dev toolbar
          include: ["astro > aria-query", "astro > axobject-query"]
        }
      };
    },
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return resolvedVirtualModuleId;
      }
    },
    configureServer(server) {
      server.ws.on("astro:devtoolbar:error:load", (args) => {
        logger.error(
          "toolbar",
          `Failed to load dev toolbar app from ${args.entrypoint}: ${args.error}`
        );
      });
      server.ws.on("astro:devtoolbar:error:init", (args) => {
        logger.error(
          "toolbar",
          `Failed to initialize dev toolbar app ${args.app.name} (${args.app.id}):
${args.error}`
        );
      });
      server.ws.on("astro:devtoolbar:app:toggled", (args) => {
        clearTimeout(telemetryTimeout);
        telemetryTimeout = setTimeout(() => {
          let nameToRecord = args?.app?.id;
          if (!nameToRecord || !nameToRecord.startsWith("astro:")) {
            nameToRecord = "other";
          }
          telemetry.record(
            eventAppToggled({
              appName: nameToRecord
            })
          );
        }, 200);
      });
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
					export const loadDevToolbarApps = async () => {
						return (await Promise.all([${settings.devToolbarApps.map(
          (plugin) => `safeLoadPlugin(async () => (await import(${JSON.stringify(
            plugin
          )})).default, ${JSON.stringify(plugin)})`
        ).join(",")}])).filter(app => app);
					};

					async function safeLoadPlugin(importEntrypoint, entrypoint) {
						try {
							const app = await importEntrypoint();

							if (typeof app !== 'object' || !app.id || !app.name) {
								throw new Error("Apps must default export an object with an id, and a name.");
							}

							return app;
						} catch (err) {
							console.error(\`Failed to load dev toolbar app from \${entrypoint}: \${err.message}\`);

							if (import.meta.hot) {
  							import.meta.hot.send('astro:devtoolbar:error:load', { entrypoint: entrypoint, error: err.message })
							}

							return undefined;
						}

						return undefined;
					}
				`;
      }
    }
  };
}
export {
  astroDevToolbar as default
};
