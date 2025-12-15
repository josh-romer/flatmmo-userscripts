
// ==UserScript==
// @name        Fix other user item enemy click conflict
// @namespace   Violentmonkey Scripts
// @match       https://flatmmo.com/play.php*
// @grant       none
// @version     0.0000001
// @author      -
// @description Fix issue where you can't click on an enemy if they are also standing on another players drop.
// @inject-into page. Currently just clicks both the enemy and the ground tile if both exist since theres no way to tell if an item is your's before clikcing on it and the update is async from the websocket
// ==/UserScript==

// Function to paint player extracted from loop in original paint_players function.
function mouse_click_handler_patched(e) {
    if(Globals.local_username == null) {
        return;
    }
    let bounding_client_rect = canvas.getBoundingClientRect();
    const relativeX = (e.clientX - bounding_client_rect.left) / canvas_scale;
    const relativeY = (e.clientY - bounding_client_rect.top) / canvas_scale;

    let clicked_tile = get_postition_from_pixel(relativeX, relativeY);

    //dev tool
    if(tile_marker_mode) {
        for(let i = 0; i < tiles_marked.length; i++) {
            let tile = tiles_marked[i];
            if(tile.x == clicked_tile.x && tile.y == clicked_tile.y) {
                tiles_marked.splice(i, 1)
                return;
            }
        }

        tiles_marked.push({x: clicked_tile.x, y: clicked_tile.y});
        return;
    }

    //highlight players
    for (let username in players) {
        if (players.hasOwnProperty(username)) {
            let player = players[username];
            if(is_mouse_on_player(mouse_over_now.x, mouse_over_now.y, player)) {
                if(e.which == 3) {
                    Globals.websocket.send('RIGHT_CLICKED_PLAYER=' + username);
                    return;
                }
            }
        }
    }

    for(let i = 0; i < ground_items.length; i++) {
        let ground_item = ground_items[i];
        if(is_mouse_on_ground_item(clicked_tile.x, clicked_tile.y, ground_item)) {
                Globals.websocket.send('CLICKED_GROUND_ITEM=' + ground_item.uuid);
                activate_click_animation("red", mouse_over_now.x, mouse_over_now.y);
                // only break if going to click npc and not right click. kinda jank but want to minimize the diff. is_hidden means the npc is dead....
                if(Object.values(npcs).some((n) => !n.is_hidden && is_mouse_on_npc(mouse_over_now.x, mouse_over_now.y, n)) && e.which !== 3) {
                  break;
                }
                return;
        }
    }

    let npcs_clicked_uuid = [];
    for (let uuid in npcs) {
        if (npcs.hasOwnProperty(uuid)) {
            let npc = npcs[uuid];
            if(npc.is_hidden) {
                continue;
            }
            // npc.is_mouse_hovering_over() -- changed for mobile fix.

            if(is_mouse_on_npc(mouse_over_now.x, mouse_over_now.y, npc)) {

                if(e.which == 3) {
                    Globals.websocket.send('MONSTER_LOG=' + npc.name);
                    return;
                }
                if(npc.has_click_priority) {
                    npcs_clicked_uuid.unshift(npc.uuid);
                } else {
                    npcs_clicked_uuid.push(npc.uuid);
                }
            }
        }
    }


    if(npcs_clicked_uuid.length > 0) {
        send_unrepeatable_bytes_1s('CLICKS_NPC=' + npcs_clicked_uuid[0]);
        activate_click_animation("red", mouse_over_now.x, mouse_over_now.y);
        return;
    }

    for(let i = 0; i < map_objects.length; i++) {
        let map_object = map_objects[i];
        if(is_mouse_on_map_object(clicked_tile.x, clicked_tile.y, map_object)) {
            if(map_object.is_interactable()) {
                if(e.which == 3) {
                    Globals.websocket.send('RIGHT_CLICKED_MAP_OBJECT=' + map_object.uuid);
                    return;
                } else {
                    send_unrepeatable_bytes_1s('CLICKED_MAP_OBJECT=' + map_object.uuid);
                    activate_click_animation("red", mouse_over_now.x, mouse_over_now.y);
                    return;
                }

            }
        }
    }




    let clicked_teleport_tile_flag = false;
    for(let i = 0; i < teleport_tiles.length; i++) {
        let teleport_tile = teleport_tiles[i];

        if(teleport_tile.x == clicked_tile.x && teleport_tile.y == clicked_tile.y) {
            clicked_teleport_tile_flag = true;
            break;
        }
    }
    if(clicked_teleport_tile_flag) {
        activate_click_animation("blue", mouse_over_now.x, mouse_over_now.y);
    } else {
        activate_click_animation("yellow", mouse_over_now.x, mouse_over_now.y);
    }

    send_unrepeatable_bytes('CLICKED_TILE=' + clicked_tile.x + "~" + clicked_tile.y);
}

// replace with patched listener
canvas.removeEventListener("mousedown", window.mouse_click_handler);
canvas.addEventListener("mousedown", mouse_click_handler_patched);
