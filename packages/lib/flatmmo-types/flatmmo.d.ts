// import type { WebSocket, WebSocketHandler } from "bun";

declare function request_focus_chatbox(): void;
declare function request_unfocus_chatbox(): void;
declare function has_npc_chat_message_modal_open(): boolean;
declare function has_npc_chat_options_modal_open(): boolean;
declare function has_modal_open(): boolean;
declare function keypress_listener(): void;
declare function keydown_listener(): void;
declare const chat_ele: HTMLInputElement;
declare function server_command(
	key: string,
	values: unknown,
	raw_data: unknown,
): void;

declare function paint_progress_bar(): void;
declare let progress_bar_active: boolean;
declare let progress_bar_at: number;
declare let progress_bar_target: number;
declare const TILE_SIZE: number;
declare const ctx: CanvasRenderingContext2D;

// const chat_ele: HTMLInputElement;
// const Globals: {websocket: WebSocket};
interface Globals {
	websocket: WebSocket;
	local_username: string;
	local_id: string;
	tab_active: boolean;
	websocket_url: string;
}

interface player {
	username: string;
	client_x: number;
	client_y: number;
	x: number;
	y: number;
	level: number;
	hp: number;
}
interface npc {
	name: string;
	client_x: number;
	client_y: number;
	x: number;
	y: number;
	in_combat: boolean;
	hp: number;
}

interface mouseOver {
	x: number;
	y: number;
	x_tile: number;
	y_tile: number;
}

declare const mouse_over_now: mouseOver;

declare const players: player[];
declare const npcs: npc[];

declare const Globals: Globals;

declare let is_volcan_heat: boolean;
