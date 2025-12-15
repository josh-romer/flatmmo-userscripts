
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
const HOTKEY_CONFIG = {
  [GM_getValue('hotkey_worship', '1')]: {
    originalKey: 'F1',
    description: 'Worship - Activates the Run worship ability'
  },
  [GM_getValue('hotkey_consumeFood', '2')]: {
    originalKey: 'F2',
    description: 'Inventory - Consumes a piece of food'
  },
  [GM_getValue('hotkey_lightFire', '3')]: {
    originalKey: 'F3',
    description: 'Inventory - Lights a fire'
  },
  [GM_getValue('hotkey_autoEquip1', 'q')]: {
    originalKey: 'F6',
    description: 'Equipment - Auto equips items that you\'ve configured'
  },
  [GM_getValue('hotkey_autoEquip2', 'w')]: {
    originalKey: 'F7',
    description: 'Equipment - Auto equips items that you\'ve configured'
  },
  [GM_getValue('hotkey_autoEquip3', 'e')]: {
    originalKey: 'F8',
    description: 'Equipment - Auto equips items that you\'ve configured'
  },
  [GM_getValue('hotkey_badge1', 'a')]: {
    originalKey: 'F9',
    description: 'Badge - Right click a badge and click the \'set key binding\''
  },
  [GM_getValue('hotkey_badge2', 's')]: {
    originalKey: 'F10',
    description: 'Badge - Right click a badge and click the \'set key binding\''
  },
  [GM_getValue('hotkey_badge3', 'd')]: {
    originalKey: 'F11',
    description: 'Badge - Right click a badge and click the \'set key binding\''
  },
  [GM_getValue('hotkey_badge4', 'f')]: {
    originalKey: 'F12',
    description: 'Badge - Right click a badge and click the \'set key binding\''
  }
};

window.removeEventListener("keypress", keypress_listener) 

//can be from canvas or chat input
const focusOrSendChat = () => {
    const value = chat_ele.value.trim();

    if (document.activeElement !== chat_ele) {
      request_focus_chatbox();
      return;
    }

    if(value !== "") {
      Globals.websocket.send('CHAT=' + value);
      chat_ele.value = "";
    }
    request_unfocus_chatbox();
}

// Just leaving this section the same as the OG as much as possible
const handleNpcChatModal = (e) => {
    let keyCode = e.keyCode;
    if(has_npc_chat_message_modal_open()) {
        if(keyCode == 32) {
            document.getElementById("npc-chat-message-modal-continue-btn").click();
            e.preventDefault();
        }
        return;
    }
    if(has_npc_chat_options_modal_open()) {
        switch(keyCode) {
            case 49: {
                let wrapper = document.getElementById("npc-chat-options-modal-content");
                let options = wrapper.getElementsByTagName("div");
                if(options[0].style.display != 'none') {
                    options[0].click();
                }
            }
            break;
            case 50:
                {
                let wrapper = document.getElementById("npc-chat-options-modal-content");
                let options = wrapper.getElementsByTagName("div");
                if(options[1].style.display != 'none') {
                    options[1].click();
                }
            }

            break;
            case 51:
                {
                let wrapper = document.getElementById("npc-chat-options-modal-content");
                let options = wrapper.getElementsByTagName("div");
                if(options[2].style.display != 'none') {
                    options[2].click();
                }
            }

            break;
            case 52:
                {
                let wrapper = document.getElementById("npc-chat-options-modal-content");
                let options = wrapper.getElementsByTagName("div");
                if(options[3].style.display != 'none') {
                    options[3].click();
                }
            }
            break;
        }
      }
}

const hotkeyListener = (e) => {
  if(e.repeat) return;
  // Checks from original handler
  if(Globals.local_username == null) return;

  if(has_npc_chat_message_modal_open()) {
    handleNpcChatModal(e);
    return;
  }
 
  if(has_modal_open()) return;

  if (e.key === "Enter") {
    focusOrSendChat();
    e.preventDefault();
  } 
  
  if(document.activeElement.id != "body") {
      return;
  }

  if (e.key in HOTKEY_CONFIG) {
    const pressedHotkey = HOTKEY_CONFIG[e.key];
    Globals.websocket.send(`SHORTCUT_KEY=${pressedHotkey.originalKey}`)
    e.preventDefault();
  }
}

window.addEventListener("keydown", hotkeyListener, false);
