import { DEFAULT_HOTKEYS } from "./DEFAULT_HOTKEYS";

export interface keypress {
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
	teleport_frostvale: actionProperties;
	hunting_contact: actionProperties;
	mass_pickup: actionProperties;
	focus: actionProperties;
	clarity: actionProperties;
};

export type HotkeyMap = Record<keyof actions, keypress>;

export interface Hotkey {
	action: keyof actions;
	hotkey: keypress;
}

export const keypressToHashableString = (keypress: keypress) => {
	return `${keypress.key}-${keypress.altKey}-${keypress.ctrlKey}-${keypress.metaKey}-${keypress.shiftKey}`.toLowerCase();
};

if (GM_getValue("hotkeys", null) === null) {
	GM_setValue("hotkeys", {});
}

let usersHotkeys: Partial<HotkeyMap> = GM_getValue("hotkeys", {});

export const mergeHotkeys = (): HotkeyMap => {
	return { ...DEFAULT_HOTKEYS, ...usersHotkeys };
};

const hashKeymap = () => {
	return Object.entries(mergeHotkeys()).reduce<Record<string, Hotkey>>(
		(result, [action, kp]) => {
			const hashed = keypressToHashableString(kp);
			result[hashed] = { action: action as keyof actions, hotkey: kp };
			return result;
		},
		{},
	);
};

export let hashedHotkeyMap = hashKeymap();

export const setHotkeys = (updatedHotkeys: Partial<HotkeyMap>) => {
	usersHotkeys = { ...usersHotkeys, ...updatedHotkeys };
	GM.setValue("hotkeys", usersHotkeys);
	hashedHotkeyMap = hashKeymap();
};

export const hashableStringToKeypress = (str: string): keypress => {
	const [key, altKey, ctrlKey, metaKey, shiftKey] = str.split("-");
	return {
		key,
		altKey: altKey === "true",
		ctrlKey: ctrlKey === "true",
		metaKey: metaKey === "true",
		shiftKey: shiftKey === "true",
	};
};
