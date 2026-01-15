import { parseSync, Visitor } from "oxc-parser";
import { Schema } from "effect";
import {
	generateMetadataString,
	type ViolentmonkeyMetadata,
} from "./UserscriptMetadata";

const PackageJson = Schema.Struct({
	name: Schema.String,
	module: Schema.String,
});
export const buildScript = async (packageName: string) => {
	const packagePath = `packages/${packageName}`;
	const file: unknown = await Bun.file(`${packagePath}/package.json`).json();
	const packageInfo = Schema.decodeUnknownSync(PackageJson)(file);
	if (typeof file !== "object") throw new Error("Must have package.json");

	const bundledScript = await getBundledScript(
		`./packages/${packageName}/${packageInfo.module}`,
	);

	// Temp auto versioning
	const defaultMetadataValues: ViolentmonkeyMetadata = {
		name: packageInfo.name
			.replaceAll("-", " ")
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" "),
		namespace: "Joshu FlatMMO Scripts",
		grant: parseGrantsCalled(bundledScript),
		match: ["https://flatmmo.com/play.php*"],
		version: `${Date.now()}${process.env.BUILD_ENV ?? ""}`,
	};
	const metadata = generateMetadataString(defaultMetadataValues);

	const finalScript = `${metadata}

${bundledScript}
	`;
	console.log(finalScript);

	Bun.write(`./dist/userscripts/${packageName}.user.js`, finalScript);
};

const parseGrantsCalled = (scriptText: string) => {
	const parsed = parseSync("userscript.js", scriptText);

	// Visit the AST
	const grants = new Set<string>();
	const visitor = new Visitor({
		CallExpression(callExp) {
			if (callExp.callee.type === "Identifier") {
				const name = callExp.callee.name;
				if (name.startsWith("GM")) {
					grants.add(name);
				}
			}
		},
	});

	visitor.visit(parsed.program);
	return Array.from(grants.keys());
};
const getBundledScript = async (entrypoint: string) => {
	const bundled = await Bun.build({
		entrypoints: [entrypoint],
	});

	return await bundled.outputs[0].text();
};
