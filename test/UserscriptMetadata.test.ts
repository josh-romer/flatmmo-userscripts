import { describe, expect, test } from "bun:test";
import {
	generateMetadataString,
	type ViolentmonkeyMetadata,
} from "../packages/build/UserscriptMetadata";

describe("generateMetadataString", () => {
	test("generates basic metadata with required fields", () => {
		const metadata: ViolentmonkeyMetadata = {
			name: "Test Script",
		};

		const result = generateMetadataString(metadata);

		expect(result).toContain("// ==UserScript==");
		expect(result).toContain("// ==/UserScript==");
		expect(result).toContain("// @name         Test Script");
	});

	test("handles optional string fields", () => {
		const metadata: ViolentmonkeyMetadata = {
			name: "Test Script",
			namespace: "https://example.com",
			version: "1.0.0",
			description: "A test script",
			icon: "https://example.com/icon.png",
		};

		const result = generateMetadataString(metadata);

		expect(result).toContain("// @name         Test Script");
		expect(result).toContain("// @namespace    https://example.com");
		expect(result).toContain("// @version      1.0.0");
		expect(result).toContain("// @description  A test script");
		expect(result).toContain("// @icon         https://example.com/icon.png");
	});

	test("handles list fields", () => {
		const metadata: ViolentmonkeyMetadata = {
			name: "Test Script",
			match: ["https://example.com/*", "https://test.com/*"],
			grant: ["GM.getValue", "GM.setValue"],
			require: ["https://cdn.example.com/lib.js"],
		};

		const result = generateMetadataString(metadata);

		expect(result).toContain("// @match        https://example.com/*");
		expect(result).toContain("// @match        https://test.com/*");
		expect(result).toContain("// @grant        GM.getValue");
		expect(result).toContain("// @grant        GM.setValue");
		expect(result).toContain("// @require      https://cdn.example.com/lib.js");
	});

	test("handles boolean fields", () => {
		const metadata: ViolentmonkeyMetadata = {
			name: "Test Script",
			noframes: true,
			unwrap: true,
		};

		const result = generateMetadataString(metadata);

		expect(result).toContain("// @noframes");
		expect(result).toContain("// @unwrap");
	});

	test("handles locale fields", () => {
		const metadata: ViolentmonkeyMetadata = {
			name: "Test Script",
			"name:zh-CN": "测试脚本",
			"name:ja": "テストスクリプト",
			description: "A test script",
			"description:zh-CN": "测试脚本描述",
		};

		const result = generateMetadataString(metadata);

		expect(result).toContain("// @name         Test Script");
		expect(result).toContain("// @name:zh-CN   测试脚本");
		expect(result).toContain("// @name:ja      テストスクリプト");
		expect(result).toContain("// @description  A test script");
		expect(result).toContain("// @description:zh-CN 测试脚本描述");
	});

	test("handles resource fields with special format", () => {
		const metadata: ViolentmonkeyMetadata = {
			name: "Test Script",
			resource: [
				{ name: "logo", url: "https://example.com/logo.png" },
				{ name: "config", url: "https://example.com/config.json" },
			],
		};

		const result = generateMetadataString(metadata);

		expect(result).toContain(
			"// @resource     logo https://example.com/logo.png",
		);
		expect(result).toContain(
			"// @resource     config https://example.com/config.json",
		);
	});

	test("handles run-at field", () => {
		const metadata: ViolentmonkeyMetadata = {
			name: "Test Script",
			"run-at": "document-idle",
		};

		const result = generateMetadataString(metadata);

		expect(result).toContain("// @run-at       document-idle");
	});

	test("handles inject-into field", () => {
		const metadata: ViolentmonkeyMetadata = {
			name: "Test Script",
			"inject-into": "page",
		};

		const result = generateMetadataString(metadata);

		expect(result).toContain("// @inject-into  page");
	});

	test("handles top-level-await field", () => {
		const metadata: ViolentmonkeyMetadata = {
			name: "Test Script",
			"top-level-await": true,
		};

		const result = generateMetadataString(metadata);

		expect(result).toContain("// @top-level-await");
	});

	test("handles URL fields", () => {
		const metadata: ViolentmonkeyMetadata = {
			name: "Test Script",
			downloadURL: "https://example.com/script.user.js",
			supportURL: "https://example.com/support",
			homepageURL: "https://example.com",
		};

		const result = generateMetadataString(metadata);

		expect(result).toContain(
			"// @downloadURL  https://example.com/script.user.js",
		);
		expect(result).toContain("// @supportURL   https://example.com/support");
		expect(result).toContain("// @homepageURL  https://example.com");
	});

	test("omits undefined optional fields", () => {
		const metadata: ViolentmonkeyMetadata = {
			name: "Test Script",
		};

		const result = generateMetadataString(metadata);

		expect(result).not.toContain("// @namespace");
		expect(result).not.toContain("// @version");
		expect(result).not.toContain("// @description");
		expect(result).not.toContain("// @match");
		expect(result).not.toContain("// @grant");
	});

	test("generates complete real-world example", () => {
		const metadata: ViolentmonkeyMetadata = {
			name: "Custom Action UI",
			"name:zh-CN": "自定义动作界面",
			namespace: "Joshu FlatMMO Scripts",
			version: "1.0.0",
			description:
				"ui tweaks to make it easier to tell at what action your character is doing",
			"description:zh-CN": "UI调整，更容易看出角色正在执行什么动作",
			match: ["https://flatmmo.com/play.php*"],
			grant: ["GM.getValue", "GM.setValue"],
			"inject-into": "page",
			"run-at": "document-idle",
		};

		const result = generateMetadataString(metadata);

		expect(result).toContain("// ==UserScript==");
		expect(result).toContain("// @name         Custom Action UI");
		expect(result).toContain("// @name:zh-CN   自定义动作界面");
		expect(result).toContain("// @namespace    Joshu FlatMMO Scripts");
		expect(result).toContain("// @version      1.0.0");
		expect(result).toContain(
			"// @description  ui tweaks to make it easier to tell at what action your character is doing",
		);
		expect(result).toContain(
			"// @description:zh-CN UI调整，更容易看出角色正在执行什么动作",
		);
		expect(result).toContain("// @match        https://flatmmo.com/play.php*");
		expect(result).toContain("// @grant        GM.getValue");
		expect(result).toContain("// @grant        GM.setValue");
		expect(result).toContain("// @inject-into  page");
		expect(result).toContain("// @run-at       document-idle");
		expect(result).toContain("// ==/UserScript==");
	});

	test("handles empty arrays", () => {
		const metadata: ViolentmonkeyMetadata = {
			name: "Test Script",
			match: [],
			grant: [],
		};

		const result = generateMetadataString(metadata);

		// Empty arrays should not generate any lines
		expect(result).not.toContain("// @match");
		expect(result).not.toContain("// @grant");
	});

	describe("strict formatting requirements", () => {
		test("first line must be exactly // ==UserScript==", () => {
			const metadata: ViolentmonkeyMetadata = {
				name: "Test Script",
			};

			const result = generateMetadataString(metadata);
			const lines = result.split("\n").filter((line) => line.trim());

			expect(lines[0]).toBe("// ==UserScript==");
		});

		test("last line must be exactly // ==/UserScript==", () => {
			const metadata: ViolentmonkeyMetadata = {
				name: "Test Script",
			};

			const result = generateMetadataString(metadata);
			const lines = result.split("\n").filter((line) => line.trim());

			expect(lines[lines.length - 1]).toBe("// ==/UserScript==");
		});

		test("every line must start with //", () => {
			const metadata: ViolentmonkeyMetadata = {
				name: "Test Script",
				namespace: "https://example.com",
				version: "1.0.0",
				match: ["https://example.com/*"],
				grant: ["GM.getValue"],
			};

			const result = generateMetadataString(metadata);
			const lines = result.split("\n").filter((line) => line.trim());

			lines.forEach((line) => {
				expect(line.startsWith("//")).toBe(true);
			});
		});

		test("every line must have exactly one space after //", () => {
			const metadata: ViolentmonkeyMetadata = {
				name: "Test Script",
				namespace: "https://example.com",
				version: "1.0.0",
				description: "A test",
				match: ["https://example.com/*"],
				grant: ["GM.getValue"],
				noframes: true,
			};

			const result = generateMetadataString(metadata);
			const lines = result.split("\n").filter((line) => line.trim());

			lines.forEach((line) => {
				// After //, there should be exactly one space
				expect(line.match(/^\/\/ /)).toBeTruthy();
				// Should not have multiple spaces after //
				expect(line.match(/^\/\/ {2}/)).toBeFalsy();
			});
		});

		test("no extraneous text at beginning of metadata block", () => {
			const metadata: ViolentmonkeyMetadata = {
				name: "Test Script",
			};

			const result = generateMetadataString(metadata);

			// Should not start with whitespace or other characters before //
			expect(result.trimStart()).toBe(result);
			expect(result.startsWith("//")).toBe(true);
		});

		test("no extraneous text at end of metadata block", () => {
			const metadata: ViolentmonkeyMetadata = {
				name: "Test Script",
			};

			const result = generateMetadataString(metadata);

			// Should end with ==/UserScript== and newline, no extra whitespace
			expect(result.trimEnd() + "\n").toBe(result);
			expect(result.trim().endsWith("// ==/UserScript==")).toBe(true);
		});

		test("no blank lines within metadata block", () => {
			const metadata: ViolentmonkeyMetadata = {
				name: "Test Script",
				namespace: "https://example.com",
				version: "1.0.0",
				match: ["https://example.com/*"],
			};

			const result = generateMetadataString(metadata);
			const lines = result.split("\n");

			// Find the metadata block (between ==UserScript== markers)
			const startIdx = lines.findIndex((l) => l.includes("==UserScript=="));
			const endIdx = lines.findIndex((l) => l.includes("==/UserScript=="));

			// Check there are no empty lines within the block
			for (let i = startIdx + 1; i < endIdx; i++) {
				expect(lines[i].trim()).not.toBe("");
			}
		});
	});
});
