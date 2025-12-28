import { parseArgs } from "util";
import { buildStaticSite } from "./build-site";

const { values } = parseArgs({
	args: Bun.argv,
	strict: true,
	options: {
		data: { type: "string" },
	},
	allowPositionals: true,
});
if (!values.data) {
	throw "must have data";
}

const data = JSON.parse(values.data);
console.log(data);

buildStaticSite(data);
