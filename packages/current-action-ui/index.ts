interface Config {
	x: number;
	y: number;
	height: number;
	width: number;
	colors: {
		activeBackgroundColor: string;
		activeForegroundColor: string;
		activeStrokeColor: string;
		idleBackgroundColor: string;
		idleStrokeColor: string;
	};
	animation: "smooth" | "default" | "off";
}
const defaultConfig: Config = {
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
	animation: "smooth",
};

if (GM_getValue("config", null) === null) {
	GM_setValue("config", defaultConfig);
}
const config = GM_getValue("config", defaultConfig);

const handleChangeColor = (
	color: string,
	field: keyof (typeof config)["colors"],
) => {
	config.colors[field] = color;
	GM_setValue(`config`, config);
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
        <input type="color" id="activeBackground" value="${config.colors.activeBackgroundColor}" style="height: 35px; cursor: pointer;" />
      </div>

      <div style="margin-bottom: 10px;">
        <label for="activeForeground" style="display: block; margin-bottom: 5px; font-size: 14px;">Foreground</label>
        <input type="color" id="activeForeground" value="${config.colors.activeForegroundColor}" style="height: 35px; cursor: pointer;" />
      </div>

      <div style="margin-bottom: 10px;">
        <label for="activeStroke" style="display: block; margin-bottom: 5px; font-size: 14px;">Stroke</label>
        <input type="color" id="activeStroke" value="${config.colors.activeStrokeColor}" style="height: 35px; cursor: pointer;" />
      </div>
    </div>
  </div>

  <div style="margin-bottom: 15px;">
    <p style="font-weight: bold; margin-bottom: 10px; color: #333;">Idle State</p>

    <div style="display: flex; gap: 10px;">
      <div style="margin-bottom: 10px;">
        <label for="idleBackground" style="display: block; margin-bottom: 5px; font-size: 14px;">Background</label>
        <input type="color" id="idleBackground" value="${config.colors.idleBackgroundColor}" style="height: 35px; cursor: pointer;" />
      </div>

      <div style="margin-bottom: 10px;">
        <label for="idleStroke" style="display: block; margin-bottom: 5px; font-size: 14px;">Stroke</label>
        <input type="color" id="idleStroke" value="${config.colors.idleStrokeColor}" style="height: 35px; cursor: pointer;" />
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

let count = 0;
let prevProgress = 0;
const countTickFraction = (() => {
	const tickFrames = 28;
	return () => {
		const totalFrames = (progress_bar_target + 1) * tickFrames;
		if (progress_bar_at <= 0 && prevProgress !== 0) {
			count = 0;
		} else {
			count = count + 1;
		}
		prevProgress = progress_bar_at;
		return Math.min(count / totalFrames, 1);
	};
})();

const getPercent = (animationType: Config["animation"]) => {
	if (animationType === "smooth") {
		return countTickFraction();
	} else if (animationType === "default") {
		return progress_bar_at / progress_bar_target;
	} else if (animationType === "off") {
		return 100;
	}
};

function paintCustomProgressBar() {
	//progress bar
	const { x, y, height, width, colors } = config;
	if (progress_bar_active) {
		const percent = getPercent(config.animation);
		ctx.fillStyle = colors.activeBackgroundColor;
		ctx.fillRect(x, y - TILE_SIZE / 8, width, height);
		ctx.fillStyle = colors.activeForegroundColor;
		ctx.fillRect(x, y - TILE_SIZE / 8, width * percent, height);
		ctx.strokeStyle = colors.activeStrokeColor;
		ctx.strokeRect(x, y - TILE_SIZE / 8, width, height);
	} else {
		prevProgress = 0;
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
window.addEventListener("keyup", setCoordinates);

unsafeWindow.paint_progress_bar = paint_progress_bar_proxy;

GM_registerMenuCommand(
	"Reset to default settings",
	() => {
		GM_setValue("config", defaultConfig);
		config.colors = defaultConfig.colors;
		config.height = defaultConfig.height;
		config.width = defaultConfig.width;
		config.x = defaultConfig.x;
		config.y = defaultConfig.y;
		config.animation = defaultConfig.animation;
	},

	{},
);

function moveBar(this: Window, ev: KeyboardEvent) {
	if (ev.altKey && ev.ctrlKey && ev.key === "z") {
		config.x = mouse_over_now.x;
		config.y = mouse_over_now.y;
	}
	if (ev.altKey && ev.ctrlKey && ev.key === "j") {
		config.width = config.width * 0.9;
		config.height = config.height * 0.9;
	}
	if (ev.altKey && ev.ctrlKey && ev.key === "k") {
		config.width = config.width * 1.1;
		config.height = config.height * 1.1;
	}
	if (ev.altKey && ev.ctrlKey && ev.key === "m") {
		const modal = document.getElementById("color-picker-modal");
		if (modal) {
			modal.style.display = modal.style.display === "none" ? "block" : "none";
		}
	}
}
function setCoordinates(this: Window, ev: KeyboardEvent) {
	if (ev.altKey && ev.ctrlKey && ev.key === "z") {
		GM_setValue("config", config);
	}
	if (ev.altKey && ev.ctrlKey && ev.key === "j") {
		GM_setValue("config", config);
	}
	if (ev.altKey && ev.ctrlKey && ev.key === "k") {
		GM_setValue("config", config);
	}
}
