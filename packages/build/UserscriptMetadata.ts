/**
 * Violentmonkey userscript metadata
 */

type LocaleKey = `${"name" | "description"}:${string}`;
export type ViolentmonkeyMetadata = {
	/**
	 * The name of the script (required)
	 * Can include language variants using suffix (e.g., 'name:zh-CN')
	 */
	name: string;

	[locales: LocaleKey]: string;

	/**
	 * Namespace for the script (defaults to empty string if not provided)
	 * Combination of namespace and name creates unique identifier
	 */
	namespace?: string;

	/**
	 * Match patterns to decide when script should execute (recommended over @include)
	 */
	match?: string[];

	/**
	 * Exclude match patterns
	 */
	"exclude-match"?: string[];

	/**
	 * Include patterns (old way, prefer @match)
	 */
	include?: string[];

	/**
	 * Exclude patterns
	 */
	exclude?: string[];

	/**
	 * Script version (required for auto-updates)
	 * Format: numeric parts joined by dots, optionally followed by letters
	 * @example '1.0', '1.2a.3'
	 */
	version?: string;

	/**
	 * Brief description of the script
	 */
	description?: string;

	/**
	 * Icon URL for the script
	 */
	icon?: string;

	/**
	 * URLs of scripts to load before this one
	 */
	require?: string[];

	/**
	 * Static resources accessible via GM_getResourceText/GM_getResourceURL
	 */
	resource?: Array<{
		name: string;
		url: string;
	}>;

	/**
	 * When the script should run
	 */
	"run-at"?:
		| "document-start"
		| "document-body"
		| "document-end"
		| "document-idle";

	/**
	 * If true, script only runs in top-level document, not nested frames
	 */
	noframes?: boolean;

	/**
	 * Special APIs and privileges to grant
	 * Use 'none' to disable sandbox, or specify individual APIs
	 * @example ['GM_getValue', 'GM_setValue', 'GM.getValue', 'window.close']
	 */
	grant?: string[] | ["none"];

	/**
	 * Context to inject the script into
	 */
	"inject-into"?: "page" | "content" | "auto";

	/**
	 * URL where script can be downloaded for updates
	 */
	downloadURL?: string;

	/**
	 * URL for support/help (linked via question mark icon)
	 */
	supportURL?: string;

	/**
	 * URL for script homepage (linked via home icon)
	 */
	homepageURL?: string;

	/**
	 * If true, inject script without wrapper into global scope (since VM2.13.1)
	 * Disables GM API access, can't be used with @top-level-await
	 */
	unwrap?: boolean;

	/**
	 * Enables top-level await in script (since VM2.19.2)
	 * Can't be used with @unwrap
	 */
	"top-level-await"?: boolean;
};

/**
 * Metadata field definitions with their types
 */
export const METADATA_FIELDS = [
	{ key: "name", type: "string" },
	{ key: "namespace", type: "string" },
	{ key: "match", type: "list" },
	{ key: "exclude-match", type: "list" },
	{ key: "include", type: "list" },
	{ key: "exclude", type: "list" },
	{ key: "version", type: "string" },
	{ key: "description", type: "string" },
	{ key: "icon", type: "string" },
	{ key: "require", type: "list" },
	{ key: "resource", type: "list" },
	{ key: "run-at", type: "string" },
	{ key: "noframes", type: "boolean" },
	{ key: "grant", type: "list" },
	{ key: "inject-into", type: "string" },
	{ key: "downloadURL", type: "string" },
	{ key: "supportURL", type: "string" },
	{ key: "homepageURL", type: "string" },
	{ key: "unwrap", type: "boolean" },
	{ key: "top-level-await", type: "boolean" },
] as const satisfies {
	key: keyof ViolentmonkeyMetadata;
	type: "string" | "list" | "boolean";
}[];

const boolToLine = (key: keyof ViolentmonkeyMetadata) => `// @${key}`;

const toLine = (key: keyof ViolentmonkeyMetadata, value: string) =>
	`// @${key.padEnd(12)} ${value}`;

const listToLine = (key: keyof ViolentmonkeyMetadata, values: string[]) => {
	return values.map((v) => toLine(key, v));
};

export const generateMetadataString = (metadata: ViolentmonkeyMetadata) => {
	const localeLines = Object.keys(metadata)
		.filter(
			(k): k is LocaleKey =>
				k.startsWith("name:") || k.startsWith("description:"),
		)
		.map((k) => toLine(k, metadata[k]));
	const lines = METADATA_FIELDS.filter((f) => metadata[f.key]).flatMap((f) => {
		if (f.type === "list") {
			// Handle array values
			if (f.key === "resource") {
				const values = metadata[f.key] ?? [];
				const to = values.map(({ name, url }) => `${name} ${url}`);
				return listToLine(f.key, to);
			}
			const values = metadata[f.key] ?? [];
			return listToLine(f.key, values);
		} else if (f.type === "boolean") {
			return boolToLine(f.key);
		} else {
			const value = metadata[f.key] ?? "";
			return toLine(f.key, value);
		}
	});
	const allLines = [...lines, ...localeLines];
	return `// ==UserScript==
${allLines.join("\n")}
// ==/UserScript==
`;
};
