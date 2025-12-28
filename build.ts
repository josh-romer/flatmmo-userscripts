import { buildScript } from "./build-userscript";
import { buildStaticSite } from "./packages/static-userscript-index/build-site";

const packageNames = ["better-custom-hotkeys", "current-action-ui"];

const userscriptInfo = packageNames.map((packageName) => ({
	path: `./dist/userscripts/${packageName}.user.js`,
	filename: `${packageName}.user.js`,
	packageName,
}));

import { rm } from "node:fs/promises";

// Delete a directory and all its contents
await rm("./dist", { recursive: true, force: true });

await Promise.all(packageNames.map(buildScript));

const time = new Date();
const result = await buildStaticSite(userscriptInfo);
console.log(time);
console.log(result.success);
