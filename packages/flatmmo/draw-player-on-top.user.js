// ==UserScript==
// @name        Draw your player on top
// @namespace   Violentmonkey Scripts
// @match       https://flatmmo.com/play.php*
// @grant       none
// @version     1.0
// @author      -
// @description 11/30/2025, 12:44:06 PM
// @inject-into page
// ==/UserScript==

// Function to paint player extracted from loop in original paint_players function.
function paint_player(username) {
	if (Object.hasOwn(players, username)) {
		const client_x = players[username].client_x;
		const client_y = players[username].client_y;
		if (
			players[username].client_pathing != null &&
			players[username].client_pathing.length > 0
		) {
			const client_next_x_y = players[username].client_pathing[0];
			const client_next_x = client_next_x_y.x;
			const client_next_y = client_next_x_y.y;
			let speed = 2;
			if (players[username].is_running) {
				speed = 4;
			}

			let moving = false;
			if (client_x != client_next_x) {
				if (client_next_x > client_x) {
					moving = true;
					players[username].client_x += speed;
					if (client_next_x < players[username].client_x) {
						players[username].client_x = client_next_x;
					}
				} else if (client_next_x < client_x) {
					moving = true;
					players[username].client_x -= speed;
					if (client_next_x > players[username].client_x) {
						players[username].client_x = client_next_x;
					}
				}
			}

			if (client_y != client_next_y) {
				if (client_next_y > client_y) {
					moving = true;
					players[username].client_y += speed;
					if (client_next_y < players[username].client_y) {
						players[username].client_y = client_next_y;
					}
				} else if (client_next_y < client_y) {
					moving = true;
					players[username].client_y -= speed;
					if (client_next_y > players[username].client_y) {
						players[username].client_y = client_next_y;
					}
				}
			}
			if (!moving) {
				players[username].client_pathing.shift();
			}
		}
		const flip = players[username].face_left;

		if (player_paint_dims.has(username)) {
			ctx.globalAlpha = 0.2;
		}
		const body_animation = get_player_animation(username, "body");
		if (body_animation != null) {
			const img = body_animation.get_frame();
			if (flip) {
				ctx.scale(-1, 1);
				ctx.drawImage(
					img,
					-1 * (players[username].client_x + TILE_SIZE + TILE_SIZE / 2),
					players[username].client_y - TILE_SIZE,
				);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			} else {
				ctx.drawImage(
					img,
					players[username].client_x - TILE_SIZE / 2,
					players[username].client_y - TILE_SIZE,
				);
			}
		}

		const necklace_animation = get_player_animation(username, "necklace");
		if (necklace_animation != null) {
			const img = necklace_animation.get_frame();
			if (flip) {
				ctx.scale(-1, 1);
				ctx.drawImage(
					img,
					-1 * (players[username].client_x + TILE_SIZE + TILE_SIZE / 2),
					players[username].client_y - TILE_SIZE,
				);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			} else {
				ctx.drawImage(
					img,
					players[username].client_x - TILE_SIZE / 2,
					players[username].client_y - TILE_SIZE,
				);
			}
		}

		const head_animation = get_player_animation(username, "head");
		if (head_animation != null) {
			const img = head_animation.get_frame();
			if (flip) {
				ctx.scale(-1, 1);
				ctx.drawImage(
					img,
					-1 * (players[username].client_x + TILE_SIZE + TILE_SIZE / 2),
					players[username].client_y - TILE_SIZE,
				);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			} else {
				ctx.drawImage(
					img,
					players[username].client_x - TILE_SIZE / 2,
					players[username].client_y - TILE_SIZE,
				);
			}
		}

		const hair_animation = get_player_animation(username, "hair");
		if (
			hair_animation != null &&
			(get_equipment(username, "head") == "none" ||
				get_equipment(username, "head") == "dark")
		) {
			const img = hair_animation.get_frame();
			if (flip) {
				ctx.scale(-1, 1);
				ctx.drawImage(
					img,
					-1 * (players[username].client_x + TILE_SIZE + TILE_SIZE / 2),
					players[username].client_y - TILE_SIZE,
				);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			} else {
				ctx.drawImage(
					img,
					players[username].client_x - TILE_SIZE / 2,
					players[username].client_y - TILE_SIZE,
				);
			}
		}

		const hat_animation = get_player_animation(username, "hat");
		if (hat_animation != null) {
			const Y_OFFSET_40_16 = 8; // ONLY FOR HATS!!!
			const img = hat_animation.get_frame();
			if (flip) {
				ctx.scale(-1, 1);
				ctx.drawImage(
					img,
					-1 * (players[username].client_x + TILE_SIZE + TILE_SIZE / 2),
					players[username].client_y - TILE_SIZE - Y_OFFSET_40_16,
				);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			} else {
				ctx.drawImage(
					img,
					players[username].client_x - TILE_SIZE / 2,
					players[username].client_y - TILE_SIZE - Y_OFFSET_40_16,
				);
			}
		}

		const legs_animation = get_player_animation(username, "legs");
		if (legs_animation != null) {
			const img = legs_animation.get_frame();
			if (flip) {
				ctx.scale(-1, 1);
				ctx.drawImage(
					img,
					-1 * (players[username].client_x + TILE_SIZE + TILE_SIZE / 2),
					players[username].client_y - TILE_SIZE,
				);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			} else {
				ctx.drawImage(
					img,
					players[username].client_x - TILE_SIZE / 2,
					players[username].client_y - TILE_SIZE,
				);
			}
		}
		const boots_animation = get_player_animation(username, "boots");
		if (boots_animation != null) {
			const img = boots_animation.get_frame();
			if (flip) {
				ctx.scale(-1, 1);
				ctx.drawImage(
					img,
					-1 * (players[username].client_x + TILE_SIZE + TILE_SIZE / 2),
					players[username].client_y - TILE_SIZE,
				);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			} else {
				ctx.drawImage(
					img,
					players[username].client_x - TILE_SIZE / 2,
					players[username].client_y - TILE_SIZE,
				);
			}
		}
		const gloves_animation = get_player_animation(username, "gloves");
		if (gloves_animation != null) {
			const img = gloves_animation.get_frame();
			if (flip) {
				ctx.scale(-1, 1);
				ctx.drawImage(
					img,
					-1 * (players[username].client_x + TILE_SIZE + TILE_SIZE / 2),
					players[username].client_y - TILE_SIZE,
				);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			} else {
				ctx.drawImage(
					img,
					players[username].client_x - TILE_SIZE / 2,
					players[username].client_y - TILE_SIZE,
				);
			}
		}
		const weapon_animation = get_player_animation(username, "weapon");
		if (weapon_animation != null) {
			const img = weapon_animation.get_frame();
			if (flip) {
				ctx.scale(-1, 1);
				ctx.drawImage(
					img,
					-1 * (players[username].client_x + TILE_SIZE + TILE_SIZE / 2),
					players[username].client_y - TILE_SIZE,
				);
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			} else {
				ctx.drawImage(
					img,
					players[username].client_x - TILE_SIZE / 2,
					players[username].client_y - TILE_SIZE,
				);
			}
		}

		ctx.globalAlpha = 1.0;

		//usernames/levels
		ctx.fillStyle = "yellow";
		const text_width = ctx.measureText(username).width;
		ctx.fillText(
			username,
			client_x + TILE_SIZE / 2 - text_width / 2,
			client_y + TILE_SIZE + TILE_SIZE / 4,
		);
		ctx.fillStyle = "white";
		const text_level_width = ctx.measureText(
			"level " + players[username].total_level,
		).width;
		if (players[username].total_level != null) {
			ctx.fillText(
				"level " + players[username].total_level,
				client_x + TILE_SIZE / 2 - text_level_width / 2,
				client_y + TILE_SIZE + TILE_SIZE / 2,
			);
		}

		//quest & ach icons

		if (
			players[username].has_all_quests &&
			players[username].all_ach_completed
		) {
			ctx.drawImage(
				quest_img,
				client_x - text_width / 2,
				client_y - 8 + (64 + TILE_SIZE / 6),
			);
			ctx.drawImage(
				ach_img,
				client_x + 12 - text_width / 2,
				client_y - 8 + (64 + TILE_SIZE / 6),
			);
		} else {
			if (players[username].has_all_quests) {
				ctx.drawImage(
					quest_img,
					client_x + 12 - text_width / 2,
					client_y - 8 + (64 + TILE_SIZE / 6),
				);
			}
			if (players[username].all_ach_completed) {
				ctx.drawImage(
					ach_img,
					client_x + 12 - text_width / 2,
					client_y - 8 + (64 + TILE_SIZE / 6),
				);
			}
		}

		//hp bar
		if (
			players[username].hp != null &&
			players[username].in_combat_ticker > 0
		) {
			const max_hp = players[username].max_hp;
			const hp = players[username].hp;
			const perc = hp / max_hp;
			ctx.fillStyle = "red";
			ctx.fillRect(
				players[username].client_x + 4,
				players[username].client_y - TILE_SIZE - TILE_SIZE / 8,
				TILE_SIZE - 8,
				10,
			);
			ctx.fillStyle = "lime";
			ctx.fillRect(
				players[username].client_x + 4,
				players[username].client_y - TILE_SIZE - TILE_SIZE / 8,
				(TILE_SIZE - 8) * perc,
				10,
			);
			players[username].in_combat_ticker--;
		}

		//shadow
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.globalAlpha = 0.2;
		ctx.ellipse(
			players[username].client_x + TILE_SIZE / 2,
			players[username].client_y + TILE_SIZE - TILE_SIZE / 8,
			25,
			14,
			Math.PI * 2,
			0,
			2 * Math.PI,
		);
		ctx.fill();
		ctx.globalAlpha = 1.0;
	}
}

// Follows code in original function, but skips painting in order to paint last.
function paint_players() {
	for (const username in players) {
		if (username === Globals.local_username) {
			continue;
		}
		paint_player(username);
	}
	paint_player(Globals.local_username);
}
window.paint_player = paint_player;
window.paint_players = paint_players;
