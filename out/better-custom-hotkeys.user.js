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

// ../../nix/store/cipbmsmi8iqqarhpiyhm2w34b3c9swz1-better-custom-hotkeys/ACTIONS.ts
var ACTIONS = {
  run: {
    originalKey: "F1",
    description: "Run",
    socketCommand: "SHORTCUT_KEY=F1"
  },
  eat: {
    originalKey: "F2",
    description: "Consumes a piece of food",
    socketCommand: "SHORTCUT_KEY=F2"
  },
  lightFire: {
    originalKey: "F3",
    description: "Lights a fire",
    socketCommand: "SHORTCUT_KEY=F3"
  },
  equip1: {
    originalKey: "F6",
    description: "Equipment Auto equips items that you've configured",
    socketCommand: "SHORTCUT_KEY=F6"
  },
  equip2: {
    originalKey: "F7",
    description: "Equipment - Auto equips items that you've configured",
    socketCommand: "SHORTCUT_KEY=F7"
  },
  equip3: {
    originalKey: "F8",
    description: "Equipment - Auto equips items that you've configured",
    socketCommand: "SHORTCUT_KEY=F8"
  },
  badge1: {
    originalKey: "F9",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "SHORTCUT_KEY=F9"
  },
  badge2: {
    originalKey: "F10",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "SHORTCUT_KEY=F10"
  },
  badge3: {
    originalKey: "F11",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "SHORTCUT_KEY=F11"
  },
  badge4: {
    originalKey: "F12",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "SHORTCUT_KEY=F12"
  },
  teleport_everbrook: {
    originalKey: "N/A",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "USE_WORSHIP=teleport_everbrook"
  },
  remote_sell: {
    originalKey: "N/A",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "USE_WORSHIP=remote_sell"
  },
  dig: {
    originalKey: "N/A",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "USE_WORSHIP=dig"
  },
  teleport_mysticvale: {
    originalKey: "N/A",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "USE_WORSHIP=teleport_mysticvale"
  },
  timers: {
    originalKey: "N/A",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "USE_WORSHIP=timers"
  },
  teleport_omboko: {
    originalKey: "N/A",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "USE_WORSHIP=teleport_omboko"
  },
  teleport_dock_haven: {
    originalKey: "N/A",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "USE_WORSHIP=teleport_dock_haven"
  },
  auto_hell_burying: {
    originalKey: "N/A",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "USE_WORSHIP=auto_hell_burying"
  },
  teleport_jafa_outpost: {
    originalKey: "N/A",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "USE_WORSHIP=teleport_jafa_outpost"
  },
  hunting_contact: {
    originalKey: "N/A",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "USE_WORSHIP=hunting_contact"
  },
  mass_pickup: {
    originalKey: "N/A",
    description: "Badge - Right click a badge and click the 'set key binding'",
    socketCommand: "USE_WORSHIP=mass_pickup"
  }
};

// ../../nix/store/cipbmsmi8iqqarhpiyhm2w34b3c9swz1-better-custom-hotkeys/DEFAULT_HOTKEYS.ts
var DEFAULT_HOTKEYS = [
  {
    action: "run",
    hotkey: {
      key: "r",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "eat",
    hotkey: {
      key: "f",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "lightFire",
    hotkey: {
      key: "4",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "equip1",
    hotkey: {
      key: "1",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "equip2",
    hotkey: {
      key: "2",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "equip3",
    hotkey: {
      key: "3",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "badge1",
    hotkey: {
      key: "a",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "badge2",
    hotkey: {
      key: "s",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "badge3",
    hotkey: {
      key: "d",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "badge4",
    hotkey: {
      key: "v",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "teleport_everbrook",
    hotkey: {
      key: "e",
      altKey: false,
      ctrlKey: true,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "remote_sell",
    hotkey: {
      key: "s",
      altKey: false,
      ctrlKey: true,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "dig",
    hotkey: {
      key: "l",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "teleport_mysticvale",
    hotkey: {
      key: "m",
      altKey: false,
      ctrlKey: true,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "timers",
    hotkey: {
      key: "0",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "teleport_omboko",
    hotkey: {
      key: "o",
      altKey: false,
      ctrlKey: true,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "teleport_dock_haven",
    hotkey: {
      key: "d",
      altKey: false,
      ctrlKey: true,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "auto_hell_burying",
    hotkey: {
      key: "f",
      altKey: false,
      ctrlKey: true,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "teleport_jafa_outpost",
    hotkey: {
      key: "j",
      altKey: false,
      ctrlKey: true,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "hunting_contact",
    hotkey: {
      key: "h",
      altKey: false,
      ctrlKey: true,
      metaKey: false,
      shiftKey: false
    }
  },
  {
    action: "mass_pickup",
    hotkey: {
      key: "p",
      altKey: false,
      ctrlKey: true,
      metaKey: false,
      shiftKey: false
    }
  }
];

// ../../nix/store/cipbmsmi8iqqarhpiyhm2w34b3c9swz1-better-custom-hotkeys/hotkeys.ts
var keypressToHashableString = (keypress) => {
  return `${keypress.key}-${keypress.altKey}-${keypress.ctrlKey}-${keypress.metaKey}-${keypress.shiftKey}`.toLowerCase();
};
var hotkeys = GM_getValue("hotkeys", DEFAULT_HOTKEYS);
var hashedHotkeyMap = hotkeys.reduce((result, hotkey) => {
  const hashed = keypressToHashableString(hotkey.hotkey);
  result[hashed] = hotkey;
  return result;
}, {});
GM_setValue("hotkeys", DEFAULT_HOTKEYS);

// ../../nix/store/cipbmsmi8iqqarhpiyhm2w34b3c9swz1-better-custom-hotkeys/index.ts
var focusOrSendChat = () => {
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
var handleNpcChatModal = (e) => {
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
          const wrapper = document.getElementById("npc-chat-options-modal-content");
          const options = wrapper?.getElementsByTagName("div");
          if (options && options[0].style.display !== "none") {
            options[0].click();
          }
        }
        break;
      case 50:
        {
          const wrapper = document.getElementById("npc-chat-options-modal-content");
          const options = wrapper?.getElementsByTagName("div");
          if (options && options[1].style.display !== "none") {
            options[1].click();
          }
        }
        break;
      case 51:
        {
          const wrapper = document.getElementById("npc-chat-options-modal-content");
          const options = wrapper?.getElementsByTagName("div");
          if (options && options[2].style.display !== "none") {
            options[2].click();
          }
        }
        break;
      case 52:
        {
          const wrapper = document.getElementById("npc-chat-options-modal-content");
          const options = wrapper?.getElementsByTagName("div");
          if (options && options[3].style.display !== "none") {
            options[3].click();
          }
        }
        break;
    }
  }
};
var hotkeyListener = (e) => {
  if (e.repeat)
    return;
  if (Globals.local_username == null)
    return;
  if (has_npc_chat_message_modal_open()) {
    handleNpcChatModal(e);
    return;
  }
  if (has_modal_open())
    return;
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
