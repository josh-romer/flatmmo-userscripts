window.removeEventListener("keydown", keydown_listener);
window.addEventListener(
	"keydown",
	(e) => {
		if (e.key.trim().length !== 0) return;
		if (chat_ele.value.trimStart().length !== 0) return;
		chat_ele.value = chat_ele.value.trimStart();

		e.preventDefault();
		e.stopPropagation();
	},
	true,
);
window.addEventListener("keydown", keydown_listener);
