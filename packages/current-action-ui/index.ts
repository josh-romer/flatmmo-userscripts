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
<div>
<p>Choose your colors:</p>

<div>
  <input type="color" id="foreground" name="foreground" value="${customConfig.foregroundColor}" />
  <label for="foreground">Foreground color</label>
</div>

<div>
  <input
    type="color"
    id="background"
    name="background"
    value="${customConfig.backgroundColor}"
    colorspace="display-p3"
    alpha />
  <label for="background">Background color</label>
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
