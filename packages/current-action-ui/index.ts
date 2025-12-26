const customConfig = {
	x: 10,
	y: 80,
	height: 20,
	width: TILE_SIZE * 2,
	colors: {
		activeBackgroundColor: "black",
		activeForegroundColor: "purple",
		activeStrokeColor: "green",
		idleBackgroundColor: "black",
		idleStrokeColor: "red",
	},
};

const handleChangeColor = (
	color: string,
	field: keyof (typeof customConfig)["colors"],
) => {
	customConfig.colors[field] = color;
};

const menuModal = `
<div id="color-picker-modal" style="
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  min-width: 320px;
  display: none;
">
  <p style="margin-top: 0; font-weight: bold;">Progress Bar Colors</p>

  <div style="margin-bottom: 20px;">
    <p style="font-weight: bold; margin-bottom: 10px; color: #333;">Active State</p>

    <div style="display: flex; gap: 10px;">
      <div style="margin-bottom: 10px;">
        <label for="activeBackground" style="display: block; margin-bottom: 5px; font-size: 14px;">Background</label>
        <input type="color" id="activeBackground" value="${customConfig.colors.activeBackgroundColor}" style="height: 35px; cursor: pointer;" />
      </div>

      <div style="margin-bottom: 10px;">
        <label for="activeForeground" style="display: block; margin-bottom: 5px; font-size: 14px;">Foreground</label>
        <input type="color" id="activeForeground" value="${customConfig.colors.activeForegroundColor}" style="height: 35px; cursor: pointer;" />
      </div>

      <div style="margin-bottom: 10px;">
        <label for="activeStroke" style="display: block; margin-bottom: 5px; font-size: 14px;">Stroke</label>
        <input type="color" id="activeStroke" value="${customConfig.colors.activeStrokeColor}" style="height: 35px; cursor: pointer;" />
      </div>
    </div>
  </div>

  <div style="margin-bottom: 15px;">
    <p style="font-weight: bold; margin-bottom: 10px; color: #333;">Idle State</p>

    <div style="display: flex; gap: 10px;">
      <div style="margin-bottom: 10px;">
        <label for="idleBackground" style="display: block; margin-bottom: 5px; font-size: 14px;">Background</label>
        <input type="color" id="idleBackground" value="${customConfig.colors.idleBackgroundColor}" style="height: 35px; cursor: pointer;" />
      </div>

      <div style="margin-bottom: 10px;">
        <label for="idleStroke" style="display: block; margin-bottom: 5px; font-size: 14px;">Stroke</label>
        <input type="color" id="idleStroke" value="${customConfig.colors.idleStrokeColor}" style="height: 35px; cursor: pointer;" />
      </div>
    </div>
  </div>

  <div style="margin-top: 15px; font-size: 12px; color: #666; text-align: center;">
    Press Ctrl+Alt+M to toggle
  </div>
</div>
`;

// Inject the modal into the page
const modalContainer = document.createElement("div");
modalContainer.innerHTML = menuModal;
document.body.appendChild(modalContainer);

// Attach event listeners to the color inputs
const activeBackgroundInput = document.getElementById(
	"activeBackground",
) as HTMLInputElement;
const activeForegroundInput = document.getElementById(
	"activeForeground",
) as HTMLInputElement;
const activeStrokeInput = document.getElementById(
	"activeStroke",
) as HTMLInputElement;
const idleBackgroundInput = document.getElementById(
	"idleBackground",
) as HTMLInputElement;
const idleStrokeInput = document.getElementById(
	"idleStroke",
) as HTMLInputElement;

activeBackgroundInput?.addEventListener("input", (e) => {
	handleChangeColor(
		(e.target as HTMLInputElement).value,
		"activeBackgroundColor",
	);
});

activeForegroundInput?.addEventListener("input", (e) => {
	handleChangeColor(
		(e.target as HTMLInputElement).value,
		"activeForegroundColor",
	);
});

activeStrokeInput?.addEventListener("input", (e) => {
	handleChangeColor((e.target as HTMLInputElement).value, "activeStrokeColor");
});

idleBackgroundInput?.addEventListener("input", (e) => {
	handleChangeColor(
		(e.target as HTMLInputElement).value,
		"idleBackgroundColor",
	);
});

idleStrokeInput?.addEventListener("input", (e) => {
	handleChangeColor((e.target as HTMLInputElement).value, "idleStrokeColor");
});

function paintCustomProgressBar() {
	//progress bar
	const { x, y, height, width, colors } = customConfig;
	if (progress_bar_active) {
		const perc = progress_bar_at / progress_bar_target;
		ctx.fillStyle = colors.activeBackgroundColor;
		ctx.fillRect(x, y - TILE_SIZE / 8, width, height);
		ctx.fillStyle = colors.activeForegroundColor;
		ctx.fillRect(x, y - TILE_SIZE / 8, width * perc, height);
		ctx.strokeStyle = colors.activeStrokeColor;
		ctx.strokeRect(x, y - TILE_SIZE / 8, width, height);
	} else {
		ctx.fillStyle = colors.idleBackgroundColor;
		ctx.fillRect(x, y - TILE_SIZE / 8, width, height);
		ctx.strokeStyle = colors.idleStrokeColor;
		ctx.strokeRect(x, y - TILE_SIZE / 8, width, height);
	}
}

const paint_progress_bar_proxy = new Proxy(paint_progress_bar, {
	// wraps
	apply(target, thisArg, argArray) {
		paintCustomProgressBar();
		target();
	},
});

window.addEventListener("keydown", moveBar);

unsafeWindow.paint_progress_bar = paint_progress_bar_proxy;

function moveBar(this: Window, ev: KeyboardEvent) {
	if (ev.altKey && ev.ctrlKey && ev.key === "z") {
		customConfig.x = mouse_over_now.x;
		customConfig.y = mouse_over_now.y;
	}
	if (ev.altKey && ev.ctrlKey && ev.key === "j") {
		customConfig.width = customConfig.width * 0.9;
		customConfig.height = customConfig.height * 0.9;
	}
	if (ev.altKey && ev.ctrlKey && ev.key === "k") {
		customConfig.width = customConfig.width * 1.1;
		customConfig.height = customConfig.height * 1.1;
	}
	if (ev.altKey && ev.ctrlKey && ev.key === "m") {
		const modal = document.getElementById("color-picker-modal");
		if (modal) {
			modal.style.display = modal.style.display === "none" ? "block" : "none";
		}
	}
}
