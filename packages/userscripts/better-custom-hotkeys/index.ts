import { ACTIONS } from "./ACTIONS";
import { hashedHotkeyMap, keypressToHashableString } from "./hotkeys";

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
					if (options && options[0].style.display !== "none") {
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
					if (options && options[1].style.display !== "none") {
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
					if (options && options[2].style.display !== "none") {
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
					if (options && options[3].style.display !== "none") {
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

	if (keypressString in hashedHotkeyMap) {
		const pressedHotkey = hashedHotkeyMap[keypressString];
		const action = ACTIONS[pressedHotkey.action];
		if (action) {
			Globals.websocket.send(action.socketCommand);
			e.preventDefault();
		}
	}
};

window.removeEventListener("keypress", keypress_listener);
window.addEventListener("keydown", hotkeyListener, false);
