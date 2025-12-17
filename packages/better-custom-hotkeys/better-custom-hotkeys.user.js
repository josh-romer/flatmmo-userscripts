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

// User Defined HotKeys - Customize via ViolentMonkey storage (GM_getValue/GM_setValue)
const DEFAULT_HOTKEYS = {
	1: {
		action: "run",
		description: "Worship - Activates the Run worship ability",
	},
	2: {
		action: "eat",
		description: "Inventory - Consumes a piece of food",
	},
	3: {
		action: "lightFire",
		description: "Inventory - Lights a fire",
	},
	q: {
		action: "equip1",
		description: "Equipment - Auto equips items that you've configured",
	},
	w: {
		action: "equip2",
		description: "Equipment - Auto equips items that you've configured",
	},
	e: {
		action: "equip3",
		description: "Equipment - Auto equips items that you've configured",
	},
	a: {
		action: "badge1",
		description: "Badge - Right click a badge and click the 'set key binding'",
	},
	s: {
		action: "badge2",
		description: "Badge - Right click a badge and click the 'set key binding'",
	},
	d: {
		action: "badge3",
		description: "Badge - Right click a badge and click the 'set key binding'",
	},
	f: {
		action: "badge4",
		description: "Badge - Right click a badge and click the 'set key binding'",
	},
};

const ACTIONS = {
	run: {
		originalKey: "F1",
		description: "Run",
		socketCommand: "SHORTCUT_KEY=F1",
	},
	eat: {
		originalKey: "F2",
		description: "Consumes a piece of food",
		socketCommand: "SHORTCUT_KEY=F2",
	},
	lightFire: {
		originalKey: "F3",
		description: "Lights a fire",
		socketCommand: "SHORTCUT_KEY=F3",
	},
	equip1: {
		originalKey: "F6",
		description: "Equipment Auto equips items that you've configured",
		socketCommand: "SHORTCUT_KEY=F6",
	},
	equip2: {
		originalKey: "F7",
		description: "Equipment - Auto equips items that you've configured",
		socketCommand: "SHORTCUT_KEY=F7",
	},
	equip3: {
		originalKey: "F8",
		description: "Equipment - Auto equips items that you've configured",
		socketCommand: "SHORTCUT_KEY=F8",
	},
	badge1: {
		originalKey: "F9",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "SHORTCUT_KEY=F9",
	},
	badge2: {
		originalKey: "F10",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "SHORTCUT_KEY=F10",
	},
	badge3: {
		originalKey: "F11",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "SHORTCUT_KEY=F11",
	},
	badge4: {
		originalKey: "F12",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "SHORTCUT_KEY=F12",
	},
};

const hotkeys = GM_getValue("hotkeys", DEFAULT_HOTKEYS);

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
const handleNpcChatModal = (e) => {
	const keyCode = e.keyCode;
	if (has_npc_chat_message_modal_open()) {
		if (keyCode == 32) {
			document.getElementById("npc-chat-message-modal-continue-btn").click();
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
					const options = wrapper.getElementsByTagName("div");
					if (options[0].style.display != "none") {
						options[0].click();
					}
				}
				break;
			case 50:
				{
					const wrapper = document.getElementById(
						"npc-chat-options-modal-content",
					);
					const options = wrapper.getElementsByTagName("div");
					if (options[1].style.display != "none") {
						options[1].click();
					}
				}

				break;
			case 51:
				{
					const wrapper = document.getElementById(
						"npc-chat-options-modal-content",
					);
					const options = wrapper.getElementsByTagName("div");
					if (options[2].style.display != "none") {
						options[2].click();
					}
				}

				break;
			case 52:
				{
					const wrapper = document.getElementById(
						"npc-chat-options-modal-content",
					);
					const options = wrapper.getElementsByTagName("div");
					if (options[3].style.display != "none") {
						options[3].click();
					}
				}
				break;
		}
	}
};

const hotkeyListener = (e) => {
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

	if (document.activeElement.id != "body") {
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
