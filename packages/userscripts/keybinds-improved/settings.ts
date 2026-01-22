import { ACTIONS } from "./ACTIONS";
import {
	mergeHotkeys,
	setHotkeys,
	keypressToHashableString,
	type keypress,
	type actions,
} from "./hotkeys";

const formatKeypress = (kp: keypress): string => {
	const parts: string[] = [];
	if (kp.ctrlKey) parts.push("Ctrl");
	if (kp.altKey) parts.push("Alt");
	if (kp.shiftKey) parts.push("Shift");
	if (kp.metaKey) parts.push("Meta");
	parts.push(kp.key.toUpperCase());
	return parts.join(" + ");
};

const formatKeypressFromEvent = (e: KeyboardEvent): string => {
	const parts: string[] = [];
	if (e.ctrlKey) parts.push("Ctrl");
	if (e.altKey) parts.push("Alt");
	if (e.shiftKey) parts.push("Shift");
	if (e.metaKey) parts.push("Meta");
	parts.push(e.key.toUpperCase());
	return parts.join(" + ");
};

const formatActionName = (action: string): string => {
	return action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const createModalStyles = (): HTMLStyleElement => {
	const style = document.createElement("style");
	style.textContent = `
		#hotkeys-modal-overlay {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.7);
			display: none;
			justify-content: center;
			align-items: center;
			z-index: 10000;
		}

		#hotkeys-modal-overlay.visible {
			display: flex;
		}

		#hotkeys-modal {
			background: #1a1a2e;
			border: 2px solid #4a4a6a;
			border-radius: 8px;
			max-width: 850px;
			max-height: 80vh;
			width: 90%;
			overflow: hidden;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
		}

		#hotkeys-modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12px 16px;
			background: #252540;
			border-bottom: 1px solid #4a4a6a;
		}

		#hotkeys-modal-header h2 {
			margin: 0;
			color: #e0e0e0;
			font-size: 18px;
		}

		#hotkeys-modal-close {
			background: none;
			border: none;
			color: #888;
			font-size: 24px;
			cursor: pointer;
			padding: 0;
			line-height: 1;
		}

		#hotkeys-modal-close:hover {
			color: #fff;
		}

		#hotkeys-modal-content {
			overflow-y: auto;
			max-height: calc(80vh - 60px);
			padding: 16px;
		}

		#hotkeys-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 8px;
			color: #e0e0e0;
		}

		.hotkey-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 8px 12px;
			border: 1px solid #333;
			border-radius: 4px;
			transition: background 0.15s ease;
		}

		.hotkey-item:hover {
			background: #252540;
		}

		.hotkey-action {
			flex: 1;
		}

		.hotkey-key {
			display: inline-block;
			background: #333;
			border: 1px solid #555;
			border-radius: 4px;
			padding: 4px 12px;
			font-family: monospace;
			font-size: 14px;
			cursor: pointer;
			transition: all 0.15s ease;
		}

		.hotkey-key:hover {
			background: #444;
			border-color: #777;
		}

		.hotkey-key.recording {
			background: #4a3a2e;
			border-color: #f0a050;
		}

		.hotkey-key.conflict {
			background: #4a2a2a;
			border-color: #c55;
		}
	`;
	return style;
};

let currentlyRecording: HTMLSpanElement | null = null;
let recordingAction: keyof actions | null = null;

const stopRecording = (restoreText = false) => {
	if (currentlyRecording) {
		if (restoreText && recordingAction) {
			const currentHotkeys = mergeHotkeys();
			currentlyRecording.textContent = formatKeypress(
				currentHotkeys[recordingAction],
			);
		}
		currentlyRecording.classList.remove("recording");
		currentlyRecording = null;
		recordingAction = null;
	}
};

// Track spans for conflict detection
const allSpans: HTMLSpanElement[] = [];

// Mark conflicts
const updateConflicts = () => {
	const currentHotkeys = mergeHotkeys();
	const hashCounts = Object.values(currentHotkeys)
		.map(keypressToHashableString)
		.reduce((acc: Record<string, number>, hash) => {
			acc[hash] = (acc[hash] || 0) + 1;
			return acc;
		}, {});

	for (const span of allSpans) {
		const action = span.dataset.action as keyof actions;
		const kp = currentHotkeys[action];
		const hash = keypressToHashableString(kp);
		const count = hashCounts[hash];
		if (count > 1) {
			span.classList.add("conflict");
		} else {
			span.classList.remove("conflict");
		}
	}
};

const startRecording = (element: HTMLSpanElement, action: keyof actions) => {
	// If clicking the same element, just stop
	if (currentlyRecording === element) {
		stopRecording(true);
		return;
	}

	// If recording a different one, stop it first
	if (currentlyRecording) {
		stopRecording(true);
	}

	// Start recording on this element
	currentlyRecording = element;
	recordingAction = action;
	element.classList.add("recording");
	element.textContent = "Press a key...";
};

const getModifierText = (e: KeyboardEvent): string => {
	const parts: string[] = [];
	if (e.ctrlKey) parts.push("Ctrl");
	if (e.altKey) parts.push("Alt");
	if (e.shiftKey) parts.push("Shift");
	if (e.metaKey) parts.push("Meta");
	return parts.length > 0 ? `${parts.join(" + ")} + ...` : "Press a key...";
};

const updateRecordingDisplay = (e: KeyboardEvent) => {
	if (!currentlyRecording) return;
	currentlyRecording.textContent = getModifierText(e);
};

const handleRecordingKeypress = (e: KeyboardEvent) => {
	if (!currentlyRecording || !recordingAction) return;

	// Show modifiers while held
	if (["Control", "Alt", "Shift", "Meta"].includes(e.key)) {
		updateRecordingDisplay(e);
		return;
	}

	e.preventDefault();
	e.stopPropagation();

	const newKeypress: keypress = {
		key: e.key,
		altKey: e.altKey,
		ctrlKey: e.ctrlKey,
		metaKey: e.metaKey,
		shiftKey: e.shiftKey,
	};

	// Save immediately
	setHotkeys({ [recordingAction]: newKeypress });

	// Update the display
	currentlyRecording.textContent = formatKeypressFromEvent(e);
	currentlyRecording.classList.remove("recording");

	// Update conflict highlighting
	updateConflicts();

	stopRecording();
};

const handleRecordingKeyup = (e: KeyboardEvent) => {
	if (!currentlyRecording) return;

	// Update display when modifiers are released
	if (["Control", "Alt", "Shift", "Meta"].includes(e.key)) {
		updateRecordingDisplay(e);
	}
};

const createModal = (): HTMLDivElement => {
	const overlay = document.createElement("div");
	overlay.id = "hotkeys-modal-overlay";

	const modal = document.createElement("div");
	modal.id = "hotkeys-modal";

	const header = document.createElement("div");
	header.id = "hotkeys-modal-header";

	const title = document.createElement("h2");
	title.textContent = "Hotkey Bindings";

	const closeBtn = document.createElement("button");
	closeBtn.id = "hotkeys-modal-close";
	closeBtn.textContent = "×";
	closeBtn.addEventListener("click", () => hideModal());

	header.appendChild(title);
	header.appendChild(closeBtn);

	const content = document.createElement("div");
	content.id = "hotkeys-modal-content";

	const grid = document.createElement("div");
	grid.id = "hotkeys-grid";

	const hotkeys = mergeHotkeys();

	for (const [action, kp] of Object.entries(hotkeys) as [
		keyof actions,
		keypress,
	][]) {
		const actionInfo = ACTIONS[action];
		if (!actionInfo) continue;

		const item = document.createElement("div");
		item.className = "hotkey-item";

		const actionName = document.createElement("span");
		actionName.className = "hotkey-action";
		actionName.textContent = formatActionName(action);

		const hotkeySpan = document.createElement("span");
		hotkeySpan.className = "hotkey-key";
		hotkeySpan.textContent = formatKeypress(kp);
		hotkeySpan.dataset.action = action;

		allSpans.push(hotkeySpan);

		hotkeySpan.addEventListener("click", () => {
			startRecording(hotkeySpan, action);
		});

		item.appendChild(actionName);
		item.appendChild(hotkeySpan);
		grid.appendChild(item);
	}

	updateConflicts();

	content.appendChild(grid);

	modal.appendChild(header);
	modal.appendChild(content);
	overlay.appendChild(modal);

	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) {
			hideModal();
		}
	});

	// Stop recording when clicking elsewhere in the modal
	modal.addEventListener("click", (e) => {
		const target = e.target as HTMLElement;
		if (!target.classList.contains("hotkey-key") && currentlyRecording) {
			stopRecording(true);
		}
	});

	return overlay;
};

let modalElement: HTMLDivElement | null = null;

const initModal = () => {
	if (modalElement) return;
	document.head.appendChild(createModalStyles());
	modalElement = createModal();
	document.body.appendChild(modalElement);
};

export const showModal = () => {
	initModal();
	modalElement?.classList.add("visible");
};

export const hideModal = () => {
	modalElement?.classList.remove("visible");
};

export const toggleModal = () => {
	initModal();
	if (modalElement?.classList.contains("visible")) {
		hideModal();
	} else {
		showModal();
	}
};

// Listen for keypresses when modal is open
document.addEventListener("keydown", (e) => {
	if (!modalElement?.classList.contains("visible")) return;

	// If recording, handle the keypress
	if (currentlyRecording) {
		// Escape cancels recording
		if (e.key === "Escape") {
			stopRecording(true);
			e.preventDefault();
			return;
		}

		handleRecordingKeypress(e);
		return;
	}

	// Escape closes modal when not recording
	if (e.key === "Escape") {
		hideModal();
		e.preventDefault();
	}
});

// Listen for key releases to update modifier display
document.addEventListener("keyup", (e) => {
	if (!modalElement?.classList.contains("visible")) return;
	handleRecordingKeyup(e);
});
