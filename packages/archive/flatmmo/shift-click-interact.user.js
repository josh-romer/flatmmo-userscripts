// ==UserScript==
// @name         FlatMMO Shift-Click NPC Interaction
// @namespace    Joshu FlatMMO Scripts
// @description  interact with npcs or attack mobs with Shift+Click to avoid picking up ground items on the same tile
// @license      MIT
// @match        https://flatmmo.com/play.php*
// ==/UserScript==

(function () {
	"use strict";

	// Wait for the canvas to be injected into the DOM
	const checkCanvas = setInterval(() => {
		const canvas = document.getElementById("canvas");
		if (canvas) {
			clearInterval(checkCanvas);
			initShiftClick(canvas);
		}
	}, 500);

	function initShiftClick(canvas) {
		// Use the capturing phase (true) to intercept the event before canvas.js processes it
		canvas.addEventListener(
			"mousedown",
			function (e) {
				// If Shift is not held down, ignore and let the normal game code handle the click
				if (!e.shiftKey) {
					return;
				}

				// Stop the game's default click handler from running simultaneously
				e.stopImmediatePropagation();
				e.preventDefault();

				// --- USER PROVIDED SCRIPT BELOW ---
				if (typeof Globals === "undefined" || Globals.local_username == null) {
					return;
				}

				let bounding_client_rect = canvas.getBoundingClientRect();

				// canvas_scale is assumed to be accessible globally based on canvas.js
				const relativeX =
					(e.clientX - bounding_client_rect.left) / canvas_scale;
				const relativeY = (e.clientY - bounding_client_rect.top) / canvas_scale;

				let clicked_tile = get_postition_from_pixel(relativeX, relativeY);
				let npcs_clicked_uuid = [];

				for (let uuid in npcs) {
					if (npcs.hasOwnProperty(uuid)) {
						let npc = npcs[uuid];
						if (npc.is_hidden) {
							continue;
						}

						if (is_mouse_on_npc(mouse_over_now.x, mouse_over_now.y, npc)) {
							// Right-click check
							if (e.which == 3) {
								Globals.websocket.send("MONSTER_LOG=" + npc.name);
								return;
							}

							if (npc.has_click_priority) {
								npcs_clicked_uuid.unshift(npc.uuid);
							} else {
								npcs_clicked_uuid.push(npc.uuid);
							}
						}
					}
				}

				// Added the execution block from canvas.js so the interaction actually fires
				if (npcs_clicked_uuid.length > 0) {
					send_unrepeatable_bytes_1s("CLICKS_NPC=" + npcs_clicked_uuid[0]);
					activate_click_animation("red", mouse_over_now.x, mouse_over_now.y);
					return;
				}
			},
			true,
		); // 'true' sets this to the capturing phase
	}
})();
