const webSocketProxy = new Proxy(server_command, {
	// wraps
	apply(target, thisArg, argArray) {
		const [key, values, raw_data] = argArray;
		target(key, values, raw_data);
		if (key === "SET_VOLCANO") {
			is_volcan_heat = false;
		}
	},
});

server_command = webSocketProxy;
