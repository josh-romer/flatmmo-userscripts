const packageName = "better-custom-hotkeys";

await Bun.build({
	entrypoints: ["./packages/better-custom-hotkeys/index.ts"],
	banner: `
// ==UserScript==
// @name        Better hotkeys
// @namespace   Violentmonkey Scripts
// @match       https://flatmmo.com/play.php*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.001
// @author      Joshu
// @description set the default f key shortcuts to regular keys, sets enter to toggle chat focus istead of always listening.
// @inject-into page
// ==/UserScript==
  `,
	outdir: "./dist",
	naming: `${packageName}.user.js`,
});
