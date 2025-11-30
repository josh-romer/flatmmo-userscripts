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

function paint_player(username) {
        if (players.hasOwnProperty(username)) {


            let client_x = players[username].client_x;
            let client_y = players[username].client_y;
            if(players[username].client_pathing != null && players[username].client_pathing.length > 0) {


                let client_next_x_y = players[username].client_pathing[0];
                let client_next_x = client_next_x_y.x;
                let client_next_y = client_next_x_y.y;
                let speed = 2;
                if(players[username].is_running) {
                    speed = 4;
                }

                let moving = false;
                if(client_x != client_next_x) {
                    if(client_next_x > client_x) {
                        moving = true;
                        players[username].client_x +=speed;
                        if(client_next_x < players[username].client_x) {
                            players[username].client_x = client_next_x;
                        }
                    } else if(client_next_x < client_x) {
                        moving = true;
                        players[username].client_x -=speed;
                        if(client_next_x > players[username].client_x) {
                            players[username].client_x = client_next_x;
                        }
                    }
                }

                if(client_y != client_next_y) {

                    if(client_next_y > client_y) {
                        moving = true;
                        players[username].client_y +=speed;
                        if(client_next_y < players[username].client_y) {
                            players[username].client_y = client_next_y;
                        }
                    } else if(client_next_y < client_y) {
                        moving = true;
                        players[username].client_y -=speed;
                        if(client_next_y > players[username].client_y) {
                            players[username].client_y = client_next_y;
                        }
                    }
                }
                if(!moving) {
                    players[username].client_pathing.shift();
                }
            }
            let flip = players[username].face_left;

            if(player_paint_dims.has(username)) {
                ctx.globalAlpha = 0.2;
            }
            let body_animation = get_player_animation(username, 'body')
            if(body_animation != null) {
                let img = body_animation.get_frame()
                if(flip) {
                    ctx.scale(-1, 1);
                    ctx.drawImage(img, -1 * (players[username].client_x + TILE_SIZE + (TILE_SIZE / 2)), players[username].client_y - TILE_SIZE);
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    ctx.drawImage(img, players[username].client_x - TILE_SIZE / 2, players[username].client_y - TILE_SIZE);
                }
            }

            let necklace_animation = get_player_animation(username, 'necklace')
            if(necklace_animation != null) {
                let img = necklace_animation.get_frame()
                if(flip) {
                    ctx.scale(-1, 1);
                    ctx.drawImage(img, -1 * (players[username].client_x + TILE_SIZE + (TILE_SIZE / 2)), players[username].client_y - TILE_SIZE);
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    ctx.drawImage(img, players[username].client_x - TILE_SIZE / 2, players[username].client_y - TILE_SIZE);
                }
            }

            let head_animation = get_player_animation(username, 'head')
            if(head_animation != null) {
                let img = head_animation.get_frame()
                if(flip) {
                    ctx.scale(-1, 1);
                    ctx.drawImage(img, -1 * (players[username].client_x + TILE_SIZE + (TILE_SIZE / 2)), players[username].client_y - TILE_SIZE);
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    ctx.drawImage(img, players[username].client_x - TILE_SIZE / 2, players[username].client_y - TILE_SIZE);
                }
            }


            let hair_animation = get_player_animation(username, 'hair')
            if(hair_animation != null && (get_equipment(username, 'head') == 'none' || get_equipment(username, 'head') == 'dark')) {
                let img = hair_animation.get_frame()
                if(flip) {
                    ctx.scale(-1, 1);
                    ctx.drawImage(img, -1 * (players[username].client_x + TILE_SIZE + (TILE_SIZE / 2)), players[username].client_y - TILE_SIZE);
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    ctx.drawImage(img, players[username].client_x - TILE_SIZE / 2, players[username].client_y - TILE_SIZE);
                }
            }

            let hat_animation = get_player_animation(username, 'hat')
            if(hat_animation != null) {
                const Y_OFFSET_40_16 = 8; // ONLY FOR HATS!!!
                let img = hat_animation.get_frame()
                if(flip) {
                    ctx.scale(-1, 1);
                    ctx.drawImage(img, -1 * (players[username].client_x + TILE_SIZE + (TILE_SIZE / 2)), players[username].client_y - TILE_SIZE - Y_OFFSET_40_16);
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    ctx.drawImage(img, players[username].client_x - TILE_SIZE / 2, players[username].client_y - TILE_SIZE - Y_OFFSET_40_16);
                }
            }

            let legs_animation = get_player_animation(username, 'legs')
            if(legs_animation != null) {
                let img = legs_animation.get_frame()
                if(flip) {
                    ctx.scale(-1, 1);
                    ctx.drawImage(img, -1 * (players[username].client_x + TILE_SIZE + (TILE_SIZE / 2)), players[username].client_y - TILE_SIZE);
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    ctx.drawImage(img, players[username].client_x - TILE_SIZE / 2, players[username].client_y - TILE_SIZE);
                }
            }
            let boots_animation = get_player_animation(username, 'boots')
            if(boots_animation != null) {
                let img = boots_animation.get_frame()
                if(flip) {
                    ctx.scale(-1, 1);
                    ctx.drawImage(img, -1 * (players[username].client_x + TILE_SIZE + (TILE_SIZE / 2)), players[username].client_y - TILE_SIZE);
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    ctx.drawImage(img, players[username].client_x - TILE_SIZE / 2, players[username].client_y - TILE_SIZE);
                }
            }
            let gloves_animation = get_player_animation(username, 'gloves')
            if(gloves_animation != null) {
                let img = gloves_animation.get_frame()
                if(flip) {
                    ctx.scale(-1, 1);
                    ctx.drawImage(img, -1 * (players[username].client_x + TILE_SIZE + (TILE_SIZE / 2)), players[username].client_y - TILE_SIZE);
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    ctx.drawImage(img, players[username].client_x - TILE_SIZE / 2, players[username].client_y - TILE_SIZE);
                }
            }
            let weapon_animation = get_player_animation(username, 'weapon')
            if(weapon_animation != null) {
                let img = weapon_animation.get_frame()
                if(flip) {
                    ctx.scale(-1, 1);
                    ctx.drawImage(img, -1 * (players[username].client_x + TILE_SIZE + (TILE_SIZE / 2)), players[username].client_y - TILE_SIZE);
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    ctx.drawImage(img, players[username].client_x - TILE_SIZE / 2, players[username].client_y - TILE_SIZE);
                }
            }

            ctx.globalAlpha = 1.0;

            //usernames/levels
            ctx.fillStyle = "yellow";
            let text_width = ctx.measureText(username).width;
            ctx.fillText(username, client_x + TILE_SIZE / 2 - text_width/2, client_y + TILE_SIZE + TILE_SIZE/4);
            ctx.fillStyle = "white";
            let text_level_width = ctx.measureText("level " + players[username].total_level).width;
            if(players[username].total_level != null) {
                ctx.fillText("level " + players[username].total_level, client_x + TILE_SIZE / 2 - text_level_width/2, client_y + TILE_SIZE + TILE_SIZE /2);
            }

            //quest & ach icons

            if(players[username].has_all_quests && players[username].all_ach_completed) {
                ctx.drawImage(quest_img, client_x - text_width / 2, client_y - 8 + (64 + TILE_SIZE / 6));
                ctx.drawImage(ach_img, client_x + 12 - text_width / 2, client_y - 8 + (64 + TILE_SIZE / 6));

            } else {
                if(players[username].has_all_quests) {
                    ctx.drawImage(quest_img, client_x  + 12 - text_width / 2, client_y - 8 + (64 + TILE_SIZE / 6));
                }
                if(players[username].all_ach_completed) {
                    ctx.drawImage(ach_img, client_x + 12 - text_width / 2, client_y - 8 + (64 + TILE_SIZE / 6));
                }
            }



            //hp bar
            if(players[username].hp != null && players[username].in_combat_ticker > 0) {
                let max_hp = players[username].max_hp;
                let hp = players[username].hp;
                let perc = hp / max_hp;
                ctx.fillStyle = "red";
                ctx.fillRect(players[username].client_x + 4, players[username].client_y - TILE_SIZE - TILE_SIZE/8, TILE_SIZE - 8, 10);
                ctx.fillStyle = "lime";
                ctx.fillRect(players[username].client_x + 4, players[username].client_y - TILE_SIZE - TILE_SIZE/8, (TILE_SIZE - 8) * perc, 10);
                players[username].in_combat_ticker--;
            }



            //shadow
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.globalAlpha = 0.2;
            ctx.ellipse(players[username].client_x + TILE_SIZE / 2, players[username].client_y + TILE_SIZE - TILE_SIZE / 8, 25, 14, Math.PI * 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
}

function paint_players() {
    for (let username in players) {
			if(username === Globals.local_username) {
        continue;
      }
      paint_player(username);
    }
    paint_player(Globals.local_username);
}
window.paint_player = paint_player;
window.paint_players = paint_players;
