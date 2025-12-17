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

	teleport_everbrook: {
		originalKey: "N/A",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "USE_WORSHIP=teleport_everbrook",
	},

	remote_sell: {
		originalKey: "N/A",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "USE_WORSHIP=remote_sell",
	},

	dig: {
		originalKey: "N/A",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "USE_WORSHIP=dig",
	},

	teleport_mysticvale: {
		originalKey: "N/A",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "USE_WORSHIP=teleport_mysticvale",
	},

	timers: {
		originalKey: "N/A",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "USE_WORSHIP=timers",
	},

	teleport_omboko: {
		originalKey: "N/A",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "USE_WORSHIP=teleport_omboko",
	},

	teleport_dock_haven: {
		originalKey: "N/A",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "USE_WORSHIP=teleport_dock_haven",
	},

	auto_hell_burying: {
		originalKey: "N/A",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "USE_WORSHIP=auto_hell_burying",
	},

	teleport_jafa_outpost: {
		originalKey: "N/A",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "USE_WORSHIP=teleport_jafa_outpost",
	},

	hunting_contact: {
		originalKey: "N/A",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "USE_WORSHIP=hunting_contact",
	},

	mass_pickup: {
		originalKey: "N/A",
		description: "Badge - Right click a badge and click the 'set key binding'",
		socketCommand: "USE_WORSHIP=mass_pickup",
	},
};

const DEFAULT_HOTKEYS: Record<
	string,
	{
		action: string;
		key: string;
		altKey: boolean;
		shiftKey: boolean;
		crtlKey: boolean;
		metaKey: boolean;
	}
> = {
	"1-false-false-false-false": {
		key: "1",
		action: "run",
		altKey: false,
		crtlKey: false,
		metaKey: false,
		shiftKey: false,
	},
	"2-false-false-false-false": {
		key: "2",
		action: "eat",
		altKey: false,
		crtlKey: false,
		metaKey: false,
		shiftKey: false,
	},
	"3-false-false-false-false": {
		key: "3",
		action: "lightFire",
		altKey: false,
		crtlKey: false,
		metaKey: false,
		shiftKey: false,
	},
	"q-false-false-false-false": {
		key: "q",
		action: "equip1",
		altKey: false,
		crtlKey: false,
		metaKey: false,
		shiftKey: false,
	},
	"w-false-false-false-false": {
		key: "w",
		action: "equip2",
		altKey: false,
		crtlKey: false,
		metaKey: false,
		shiftKey: false,
	},
	"e-false-false-false-false": {
		key: "e",
		action: "equip3",
		altKey: false,
		crtlKey: false,
		metaKey: false,
		shiftKey: false,
	},
	"a-false-false-false-false": {
		key: "a",
		action: "badge1",
		altKey: false,
		crtlKey: false,
		metaKey: false,
		shiftKey: false,
	},
	"s-false-false-false-false": {
		key: "s",
		action: "badge2",
		altKey: false,
		crtlKey: false,
		metaKey: false,
		shiftKey: false,
	},
	"d-false-false-false-false": {
		key: "d",
		action: "badge3",
		altKey: false,
		crtlKey: false,
		metaKey: false,
		shiftKey: false,
	},
	"f-false-false-false-false": {
		key: "f",
		action: "badge4",
		altKey: false,
		crtlKey: false,
		metaKey: false,
		shiftKey: false,
	},
	"f-false-true-false-true": {
		key: "f",
		action: "teleport_everbrook",
		altKey: false,
		crtlKey: true,
		metaKey: false,
		shiftKey: true,
	},
};

interface keypress {
	key: string;
	altKey: boolean;
	ctrlKey: boolean;
	metaKey: boolean;
	shiftKey: boolean;
}

const keypressToHashableString = (keypress: keypress) => {
	return `${keypress.key}-${keypress.altKey}-${keypress.ctrlKey}-${keypress.metaKey}-${keypress.shiftKey}`.toLowerCase();
};

const hashableStringToKeypress = (str: string) => {
	const [key, altKey, ctrlKey, metaKey, shiftKey] = str.split("-");
	return {
		key,
		altKey,
		ctrlKey,
		metaKey,
		shiftKey,
	};
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
		Globals.websocket.send(`CHAT=${value}`);
		chat_ele.value = "";
	}
	request_unfocus_chatbox();
};

// Just leaving this section the same as the OG as much as possible
const handleNpcChatModal = (e: KeyboardEvent) => {
	const keyCode = e.keyCode;
	if (has_npc_chat_message_modal_open()) {
		if (keyCode === 32) {
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

	if (document.activeElement?.id !== "body") {
		return;
	}

	if (e.key === "/") {
		chat_ele.value = "/";
		request_focus_chatbox();
		e.preventDefault();
	}

	const keypressString = keypressToHashableString(e);

	if (keypressString in hotkeys) {
		const pressedHotkey = hotkeys[keypressString];
		const action = ACTIONS[pressedHotkey.action];
		if (action) {
			Globals.websocket.send(action.socketCommand);
			e.preventDefault();
		}
	}
};

window.removeEventListener("keypress", keypress_listener);
window.addEventListener("keydown", hotkeyListener, false);
