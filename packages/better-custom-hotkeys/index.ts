// import { chat_ele, request_focus_chatbox, Globals, request_unfocus_chatbox, has_npc_chat_message_modal_open, has_modal_open, has_npc_chat_options_modal_open, keypress_listener } from "flatmmo";

// User Defined HotKeys - Customize via ViolentMonkey storage (GM_getValue/GM_setValue)
const HOTKEY_CONFIG: {
	[x: string]: { originalKey: string; description: string };
} = {
	[GM_getValue<string>("hotkey_worship", "1")]: {
		originalKey: "F1",
		description: "Worship - Activates the Run worship ability",
	},
	[GM_getValue<string>("hotkey_consumeFood", "2")]: {
		originalKey: "F2",
		description: "Inventory - Consumes a piece of food",
	},
	[GM_getValue<string>("hotkey_lightFire", "3")]: {
		originalKey: "F3",
		description: "Inventory - Lights a fire",
	},
	[GM_getValue<string>("hotkey_autoEquip1", "q")]: {
		originalKey: "F6",
		description: "Equipment - Auto equips items that you've configured",
	},
	[GM_getValue<string>("hotkey_autoEquip2", "w")]: {
		originalKey: "F7",
		description: "Equipment - Auto equips items that you've configured",
	},
	[GM_getValue<string>("hotkey_autoEquip3", "e")]: {
		originalKey: "F8",
		description: "Equipment - Auto equips items that you've configured",
	},
	[GM_getValue<string>("hotkey_badge1", "a")]: {
		originalKey: "F9",
		description: "Badge - Right click a badge and click the 'set key binding'",
	},
	[GM_getValue<string>("hotkey_badge2", "s")]: {
		originalKey: "F10",
		description: "Badge - Right click a badge and click the 'set key binding'",
	},
	[GM_getValue<string>("hotkey_badge3", "d")]: {
		originalKey: "F11",
		description: "Badge - Right click a badge and click the 'set key binding'",
	},
	[GM_getValue<string>("hotkey_badge4", "f")]: {
		originalKey: "F12",
		description: "Badge - Right click a badge and click the 'set key binding'",
	},
};

//can be from canvas or chat input
const focusOrSendChat = () => {
	const value = chat_ele.value.trim();

	if (document.activeElement !== chat_ele) {
		request_focus_chatbox();
		return;
	}

	if (value !== "") {
		Globals.websocket.send("CHAT=" + value);
		chat_ele.value = "";
	}
	request_unfocus_chatbox();
};

// Just leaving this section the same as the OG as much as possible
const handleNpcChatModal = (e: KeyboardEvent) => {
	const keyCode = e.keyCode;
	if (has_npc_chat_message_modal_open()) {
		if (keyCode == 32) {
			document.getElementById("npc-chat-message-modal-continue-btn")?.click();
			e.preventDefault();
		}
		return;
	}
	if (has_npc_chat_options_modal_open()) {
		switch (keyCode) {
			case 49:
				{
					const wrapper = document.getElementById(
						"npc-chat-options-modal-content",
					);
					const options = wrapper?.getElementsByTagName("div");
					if (options && options[0].style.display != "none") {
						options[0].click();
					}
				}
				break;
			case 50:
				{
					const wrapper = document.getElementById(
						"npc-chat-options-modal-content",
					);
					const options = wrapper?.getElementsByTagName("div");
					if (options && options[1].style.display != "none") {
						options[1].click();
					}
				}

				break;
			case 51:
				{
					const wrapper = document.getElementById(
						"npc-chat-options-modal-content",
					);
					const options = wrapper?.getElementsByTagName("div");
					if (options && options[2].style.display != "none") {
						options[2].click();
					}
				}

				break;
			case 52:
				{
					const wrapper = document.getElementById(
						"npc-chat-options-modal-content",
					);
					const options = wrapper?.getElementsByTagName("div");
					if (options && options[3].style.display != "none") {
						options[3].click();
					}
				}
				break;
		}
	}
};

const hotkeyListener = (e: KeyboardEvent) => {
	if (e.repeat) return;
	// Checks from original handler
	if (Globals.local_username == null) return;

	if (has_npc_chat_message_modal_open()) {
		handleNpcChatModal(e);
		return;
	}

	if (has_modal_open()) return;

	if (e.key === "Enter") {
		focusOrSendChat();
		e.preventDefault();
	}

	if (document.activeElement?.id != "body") {
		return;
	}

	if (e.key === "/") {
		chat_ele.value = "/";
		request_focus_chatbox();
		e.preventDefault();
	}

	if (e.key in HOTKEY_CONFIG) {
		const pressedHotkey = HOTKEY_CONFIG[e.key];
		Globals.websocket.send(`SHORTCUT_KEY=${pressedHotkey.originalKey}`);
		e.preventDefault();
	}
};

window.removeEventListener("keypress", keypress_listener);
window.addEventListener("keydown", hotkeyListener, false);
