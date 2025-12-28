import { addScriptLinksRewriter } from "./write-html";

export const buildStaticSite = (
	userscriptInfo: { filename: string; packageName: string; path: string }[],
) =>
	Bun.build({
		entrypoints: [
			"./packages/static-userscript-index/index.html",
			...userscriptInfo.map((us) => us.path),
		],
		outdir: "./dist/static",
		loader: { ".js": "file" },
		naming: {
			chunk: `[name].[ext]`,
			asset: `[name].[ext]`,
			entry: `[name].[ext]`,
		},
		root: ".",
		splitting: false,
		plugins: [
			{
				// A plugin that makes every HTML tag lowercase
				name: "add-user-scripts",
				setup({ onLoad }) {
					onLoad({ filter: /\.html$/ }, async (args) => {
						const html = await Bun.file(args.path).text();

						return {
							contents: addScriptLinksRewriter(html, userscriptInfo),
							loader: "html",
						};
					});
				},
			},
		],
	});
