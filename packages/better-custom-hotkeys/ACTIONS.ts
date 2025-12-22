import type { actions } from "./hotkeys";

export const ACTIONS: actions = {
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
