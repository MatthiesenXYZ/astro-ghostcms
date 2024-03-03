import packageJson from "package-json";

export type Options = {
	/**
	A semver range or [dist-tag](https://docs.npmjs.com/cli/dist-tag).
	*/
	readonly version?: string;
};

/**
Get the latest version of an npm package.

@example
```
console.log(await latestVersion('ava'));
//=> '0.18.0'
```
*/
export default async function latestVersion(
	packageName: string,
	options?: Options,
) {
	const { version } = await packageJson(packageName.toLowerCase(), options);

	return version;
}
