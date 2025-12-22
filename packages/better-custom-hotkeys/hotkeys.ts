import { DEFAULT_HOTKEYS } from "./DEFAULT_HOTKEYS";

interface keypress {
	key: string;
	altKey: boolean;
	ctrlKey: boolean;
	metaKey: boolean;
	shiftKey: boolean;
}

interface actionProperties {
	originalKey: string;
	description: string;
	socketCommand: string;
}

export type actions = {
	run: actionProperties;
	eat: actionProperties;
	lightFire: actionProperties;
	equip1: actionProperties;
	equip2: actionProperties;
	equip3: actionProperties;
	badge1: actionProperties;
	badge2: actionProperties;
	badge3: actionProperties;
	badge4: actionProperties;
	teleport_everbrook: actionProperties;
	remote_sell: actionProperties;
	dig: actionProperties;
	teleport_mysticvale: actionProperties;
	timers: actionProperties;
	teleport_omboko: actionProperties;
	teleport_dock_haven: actionProperties;
	auto_hell_burying: actionProperties;
	teleport_jafa_outpost: actionProperties;
	hunting_contact: actionProperties;
	mass_pickup: actionProperties;
};

export interface hotkey {
	action: keyof actions;
	hotkey: keypress;
}

export const keypressToHashableString = (keypress: keypress) => {
	return `${keypress.key}-${keypress.altKey}-${keypress.ctrlKey}-${keypress.metaKey}-${keypress.shiftKey}`.toLowerCase();
};

const hotkeys = GM_getValue("hotkeys", DEFAULT_HOTKEYS);
export const hashedHotkeyMap = hotkeys.reduce<Record<string, hotkey>>(
	(result, hotkey) => {
		const hashed = keypressToHashableString(hotkey.hotkey);
		result[hashed] = hotkey;
		return result;
	},
	{},
);

export const hashableStringToKeypress = (str: string) => {
	const [key, altKey, ctrlKey, metaKey, shiftKey] = str.split("-");
	return {
		key,
		altKey,
		ctrlKey,
		metaKey,
		shiftKey,
	};
};
