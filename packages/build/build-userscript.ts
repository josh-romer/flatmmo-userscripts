export const buildScript = async (packageName: string) => {
	const packagePath = `../${packageName}`;
	const { default: packageJson } = await import(`${packagePath}/package.json`, {
		with: { type: "jsonc" },
	});
	const { default: metadata } = await import(`${packagePath}/metadata.js`, {
		with: { type: "text" },
	});
	return Bun.build({
		entrypoints: [`./packages/${packageName}/${packageJson.module}`],
		banner: metadata,
		outdir: `./dist/userscripts`,
		naming: `${packageName}.user.[ext]`,
		root: ".",
	});
};
