import { watch } from "fs";
import { $ } from "bun";

await $`bun run build-static`; // => "Hello, world!"
const watchDir = import.meta.env.PACKAGESDIR;
const watcher = watch(
	watchDir,
	{ recursive: true },
	async (event, filename) => {
		console.log(`Detected ${event} in ${filename}`);
		await $`bun run build-static`; // => "Hello, world!"
	},
);

process.on("SIGINT", () => {
	// close watcher when Ctrl-C is pressed
	watcher.close();

	process.exit(0);
});
