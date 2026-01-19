import { parseArgs } from "util";
import { buildScript } from "./build-userscript";
import { watch } from "fs";

const { values, positionals } = parseArgs({
	args: Bun.argv,
	strict: true,
	options: {
		dev: { type: "boolean" },
	},
	positionals: ["scriptName"],
	allowPositionals: true,
});

const name = positionals[2];
const dev = values.dev;

const runBuild = async () => {
	const t0 = performance.now();
	try {
		const filePath = await buildScript(name);
		const url = Bun.pathToFileURL(filePath);
		const t1 = performance.now();

		console.log("");
		console.log(`Wrote ${name} in ${t1 - t0} milliseconds to:`);
		console.log(url.href); // "file:///foo/bar.txt"
		console.log(url.pathname); // "file:///foo/bar.txt"
		console.log("");
	} catch (e) {
		console.log(`Error while bundling ${name}:`);
		console.log(e); // "TypeError"
	}
};

await runBuild();

if (dev) {
	const watchDir = `${import.meta.env.PACKAGESDIR}/userscripts/${name}`;

	const watcher = watch(
		watchDir,
		{ recursive: true },
		async (event, filename) => {
			console.log(`Detected ${event} in ${filename}`);
			await runBuild();
		},
	);

	process.on("SIGINT", () => {
		// close watcher when Ctrl-C is pressed
		watcher.close();

		process.exit(0);
	});
}
