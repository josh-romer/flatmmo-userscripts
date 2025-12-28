export const addScriptLinksRewriter = (
	html: string,
	userscriptPaths: { filename: string; packageName: string }[],
) => {
	const rewriter = new HTMLRewriter().on("#script-list", {
		element(ul) {
			userscriptPaths.forEach((us) => {
				ul.append(
					`
				<li><a href="${us.filename}">
					${us.packageName}
				</a></li>`,
					{
						html: true,
					},
				);
			});
		},
	});

	const result = rewriter.transform(html);
	return result;
};
