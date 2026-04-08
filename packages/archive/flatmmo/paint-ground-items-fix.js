function paint_ground_items() {
	let ground_items_seen = {};
	for (let i = 0; i < ground_items.length; i++) {
		let ground_item = ground_items[i];
		const curr_coord = [ground_item.x, ground_item.y];

		if (!ground_items_seen[curr_coord] && ground_items_seen[curr_coord] !== 0) {
			ground_items_seen[curr_coord] = 0;
		} else {
			ground_items_seen[curr_coord] = ground_items_seen[curr_coord] + 1;
		}

		const count_seen = ground_items_seen[curr_coord];

		let label = format_snake_case(ground_item.name);
		if (count_seen == 3) {
			label = "...";
		}
		if (ground_item.amount > 1) {
			label += " (" + format_number(ground_item.amount) + ")";
		}
		let text_width = ctx.measureText(label).width;
		ctx.fillStyle = "silver";
		ctx.globalAlpha = 1.0;
		if (count_seen < 4) {
			ctx.fillText(
				label,
				ground_item.x * TILE_SIZE + TILE_SIZE / 2 - text_width / 2,
				ground_item.y * TILE_SIZE + TILE_SIZE + 4 + count_seen * 15,
			);
			ctx.globalAlpha = ground_item.get_opacity();
			ctx.drawImage(
				ground_item.image,
				ground_item.x * TILE_SIZE + TILE_SIZE / 12,
				ground_item.y * TILE_SIZE + TILE_SIZE / 12,
			);
		}
	}
}
