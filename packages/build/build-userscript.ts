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
	const packagePath = `packages/userscripts/${packageName}`;
	const file: unknown = await Bun.file(`${packagePath}/package.json`).json();
	const packageInfo = Schema.decodeUnknownSync(PackageJson)(file);
	if (typeof file !== "object") throw new Error("Must have package.json");

	const bundledScript = await getBundledScript(
		`./packages/userscripts/${packageName}/${packageInfo.module}`,
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

	const scriptDest = `./dist/userscripts/${packageName}.user.js`;
	await Bun.write(scriptDest, finalScript);
	return scriptDest;
};

const parseGrantsCalled = (scriptText: string) => {
	const parsed = parseSync("userscript.js", scriptText);

	// Visit the AST
	const grants = new Set<string>();
	const visitor = new Visitor({
		CallExpression({ callee }) {
			const { type } = callee;
			if (type === "Identifier") {
				const name = callee.name;
				if (name.startsWith("GM")) {
					grants.add(name);
				}
			}
			if (
				type === "MemberExpression" &&
				callee.object.type === "Identifier" &&
				callee.object.name === "GM"
			) {
				const { property } = callee;
				if (property.type === "Identifier") {
					grants.add(`GM.${property.name}`);
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
