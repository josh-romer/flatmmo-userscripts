// ==UserScript==
// @name        FlatMMO Wiki Table Links
// @namespace   Violentmonkey Scripts
// @match       https://flatmmo.wiki/index.php/*
// @grant       none
// @version     1.0
// @author      -
// @description Adds anchor links to wikitable rows based on first column text
// ==/UserScript==

(() => {
	// Find all wikitable tables
	const tables = document.querySelectorAll("table.wikitable");

	tables.forEach((table) => {
		const rows = table.querySelectorAll("tbody tr");

		rows.forEach((row) => {
			// Skip header rows (rows with th elements)
			if (row.querySelector("th")) return;

			// Get first column
			const firstCell = row.querySelector("td");
			if (!firstCell) return;

			// Get text content and create ID
			const text = firstCell.textContent.trim();
			if (!text) return;

			// Create a URL-safe ID from the text
			const id = text.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");

			// Set ID on the row
			row.id = id;

			// Create anchor link
			const link = document.createElement("a");
			link.href = `#${id}`;
			link.textContent = "#";
			link.style.marginLeft = "5px";
			link.style.textDecoration = "none";
			link.style.color = "#999";
			link.style.fontSize = "0.9em";
			link.title = `Link to ${text}`;

			// Add hover effect
			link.addEventListener("mouseenter", () => {
				link.style.color = "#0645ad";
			});
			link.addEventListener("mouseleave", () => {
				link.style.color = "#999";
			});

			// Add link to first cell
			firstCell.appendChild(link);
		});
	});
})();
