const customConfig = {
	x: 10,
	y: 80,
	height: 20,
	width: TILE_SIZE * 2,
	backgroundColor: "black",
	foregroundColor: "purple",
};

const handleChangeColor = (
	color: string,
	field: "backgroundColor" | "foregroundColor",
) => {
	customConfig[field] = color;
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
  min-width: 300px;
">
  <p style="margin-top: 0; font-weight: bold;">Choose your colors:</p>

  <div style="margin-bottom: 15px;">
    <label for="foreground" style="display: block; margin-bottom: 5px;">Foreground color</label>
    <input type="color" id="foreground" name="foreground" value="${customConfig.foregroundColor}" style="width: 100%; height: 40px; cursor: pointer;" />
  </div>

  <div style="margin-bottom: 10px;">
    <label for="background" style="display: block; margin-bottom: 5px;">Background color</label>
    <input
      type="color"
      id="background"
      name="background"
      value="${customConfig.backgroundColor}"
      colorspace="display-p3"
      alpha
      style="width: 100%; height: 40px; cursor: pointer;" />
  </div>
</div>
`;

// Inject the modal into the page
const modalContainer = document.createElement("div");
modalContainer.innerHTML = menuModal;
document.body.appendChild(modalContainer);

// Attach event listeners to the color inputs
const foregroundInput = document.getElementById(
	"foreground",
) as HTMLInputElement;
const backgroundInput = document.getElementById(
	"background",
) as HTMLInputElement;

foregroundInput?.addEventListener("input", (e) => {
	handleChangeColor((e.target as HTMLInputElement).value, "foregroundColor");
});

backgroundInput?.addEventListener("input", (e) => {
	handleChangeColor((e.target as HTMLInputElement).value, "backgroundColor");
});

function paintCustomProgressBar() {
	//progress bar
	if (progress_bar_active) {
		const { x, y, height, width } = customConfig;
		const perc = progress_bar_at / progress_bar_target;
		ctx.fillStyle = customConfig.backgroundColor;
		ctx.fillRect(x, y - TILE_SIZE / 8, width, height);
		ctx.fillStyle = customConfig.foregroundColor;
		ctx.fillRect(x, y - TILE_SIZE / 8, width * perc, height);
		ctx.strokeStyle = "green";
		ctx.strokeRect(x, y - TILE_SIZE / 8, width, height);
	} else {
		const { x, y, height, width } = customConfig;
		ctx.fillStyle = customConfig.backgroundColor;
		ctx.fillRect(x, y - TILE_SIZE / 8, width, height);
		ctx.strokeStyle = "red";
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
}
