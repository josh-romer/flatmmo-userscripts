import { parseArgs } from "util";
import { buildScript } from "./build-userscript";

const { values } = parseArgs({
	args: Bun.argv,
	strict: true,
	options: {
		scriptName: { type: "string" },
	},
	allowPositionals: true,
});
if (!values.scriptName) {
	throw "must have data";
}

const name = values.scriptName;

buildScript(name);
