export const buildScript = async (packageName: string) => {
	const packagePath = `../${packageName}`;
	const { default: packageJson } = await import(`${packagePath}/package.json`, {
		with: { type: "jsonc" },
	});
	// Temp auto versioning
	const version = `${Date.now()}${process.env.BUILD_ENV ?? ""}`;
	const metadata = (
		await Bun.file(`./packages/${packageName}/metadata.js`).text()
	).replace(/VERSION/, version);
	return Bun.build({
		entrypoints: [`./packages/${packageName}/${packageJson.module}`],
		banner: metadata,
		outdir: `./dist/userscripts`,
		naming: `${packageName}.user.[ext]`,
		root: ".",
	});
};
