/* @refresh reload */

import { createSignal, For, type Component } from "solid-js";
import { render } from "solid-js/web";
// import cssString from "./App.module.css" with { type: "text" };
import styles from "./App.module.css";

// import 'solid-devtools';

// import './index.css';
const root = document.createElement("div");
const body = document.getElementById("body");
body.appendChild(root);
// GM.addStyle(cssString);

// if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
//   throw new Error(
//     'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
//   );
// }
const [currPlayers, setPlayers] = createSignal<string[]>([]);
const [items, setItems] = createSignal<string[]>([]);
const [currNpcs, setCurrNpcs] = createSignal<string[]>([]);

const [progressBarStatus, setCount] = createSignal({
	progress_bar_at,
	progress_bar_active,
	progress_bar_target,
	current_action_uuid,
});
const [socketEvents, setSocketEvents] = createSignal<string[]>([]);
const setLatestSocketEvents = (key: string) => {
	if (socketEvents().length >= 10) {
		setSocketEvents([key, ...socketEvents().slice(0, 10)]);
	} else {
		setSocketEvents([key, ...socketEvents()]);
	}
};
const webSocketProxy = new Proxy(server_command, {
	// wraps
	apply(target, thisArg, argArray) {
		const [key, values, raw_data] = argArray;
		// console.log(target.arguments);
		// console.log(key, values, raw_data);
		target(key, values, raw_data);
		if (key === "PROGRESS_BAR" || key === "PROGRESS_BAR_OFF") {
			setCount({
				progress_bar_at,
				progress_bar_active,
				progress_bar_target,
				current_action_uuid,
			});
		}
		if (key === "ACTION_ID_UPDATED") {
			setCount({
				progress_bar_at,
				progress_bar_active,
				progress_bar_target,
				current_action_uuid,
			});
		}
		setPlayers(
			Object.entries(players).map(
				([name, p]) => `${name} hp: ${p.hp ?? "-"} x:${p.x} y:${p.y}`,
			),
		);
		setCurrNpcs(
			Object.values(npcs).map(
				(p) =>
					`${p.name} hp: ${p.hp} x:${p.x} y:${p.y} in_combat: ${p.in_combat}`,
			),
		);
		setLatestSocketEvents(key);
	},
});

server_command = webSocketProxy;

const ProgressTracker: Component = () => {
	return (
		<div class={styles.App}>
			<div>
				<h3>Status</h3>
				<p>
					progress_bar_active:{" "}
					{progressBarStatus().progress_bar_active.toString()}
				</p>
			</div>
			<div>
				<p>progress_bar_at: {progressBarStatus().progress_bar_at}</p>
			</div>
			<div>
				<p>progress_bar_target: {progressBarStatus().progress_bar_target}</p>
			</div>
			<div>
				<p>current_action_id: {progressBarStatus().current_action_uuid}</p>
			</div>
		</div>
	);
};

const SocketChatter: Component = () => {
	return (
		<div>
			<h3>Recent Socket Messages</h3>
			<For each={socketEvents()}>
				{(socket, i) => (
					<p>
						{i()}: {socket}
					</p>
				)}
			</For>{" "}
		</div>
	);
};
const Players: Component = () => {
	return (
		<div>
			<h3>Players</h3>
			<For each={currPlayers()}>
				{(socket, i) => (
					<p>
						{i()}: {socket}
					</p>
				)}
			</For>{" "}
		</div>
	);
};
const Npcs: Component = () => {
	return (
		<div>
			<h3>NPCs</h3>
			<For each={currNpcs()}>
				{(socket, i) => (
					<p>
						{i()}: {socket}
					</p>
				)}
			</For>{" "}
		</div>
	);
};

const App: Component = () => {
	return (
		<div class={styles.App}>
			<header class={styles.header}>
				<div class={styles.columns}>
					<ProgressTracker />
					<SocketChatter />
					<Players />
					<Npcs />
				</div>
			</header>
		</div>
	);
};

render(() => <App />, root);
