import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import type { SatoriAstroOGOptions, ToSvgOptions, ToImageOptions, ToResponseOptions } from "../../types.js";

const satoriOG = ({ width, height, template }: SatoriAstroOGOptions) => {
	return {
		async toSvg(options: ToSvgOptions) {
			return await satori(template, { width, height, ...options });
		},
		async toImage({ satori: satoriOptions, resvg: _resvgOptions }: ToImageOptions) {
			const resvgOptions =
				typeof _resvgOptions === "function"
					? _resvgOptions({ width, height })
					: _resvgOptions;

			return new Resvg(await this.toSvg(satoriOptions), {
				fitTo: { mode: "width", value: width },
				...resvgOptions,
			}).render().asPng();
		},
		async toResponse({ response: init, ...rest }: ToResponseOptions) {
			const image = await this.toImage(rest);

			return new Response(image, {...init,
				headers: {
					"Content-Type": "image/png",
					"Content-Length": image.length.toString(),
					"Cache-Control": "public, max-age=31536000, immutable",
					...init?.headers,
				},
			});
		},
	};
};

export default satoriOG;

export function getOgImagePath(filename = "index"):string {
	if (filename.startsWith("/")) 
		filename = filename.substring(1);
	if (filename.endsWith("/"))
	  	filename = filename.substring(0, filename.length - 1);
	if (filename === "") filename = "index";
	return `./open-graph/${filename}.png`;
  };

