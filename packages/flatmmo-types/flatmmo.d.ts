// import type { WebSocket, WebSocketHandler } from "bun";

declare function request_focus_chatbox(): void;
declare function request_unfocus_chatbox(): void;
declare function has_npc_chat_message_modal_open(): boolean;
declare function has_npc_chat_options_modal_open(): boolean;
declare function has_modal_open(): boolean;
declare function keypress_listener(): void;
declare const chat_ele: HTMLInputElement;

    // const chat_ele: HTMLInputElement;
   // const Globals: {websocket: WebSocket};
   interface Globals {
     websocket: WebSocket;
     local_username: string;
     local_id: string;
     tab_active: boolean;
     websocket_url: string;
   }

declare const Globals: Globals;
