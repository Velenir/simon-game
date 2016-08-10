const corners = document.querySelectorAll(".outer__corner");

function attachAnimations() {

	const timings = {
		duration: 1000
		// fill: 'both',
		// direction: 'alternate',
		// iterations: Infinity
	};

	const partialKeyframes = [
		{backgroundColor: "yellow", boxShadow: "0 0 10px white, inset 0 0 15px 2px gray"},
		{boxShadow: "0 0 10px white, inset 0 0 15px 10px gray"}
	];

	for(let cn of corners) {
		const backgroundColor = getComputedStyle(cn).backgroundColor;

		const kEffect = new KeyframeEffect(cn, [partialKeyframes[0], Object.assign({}, partialKeyframes[1], {backgroundColor})], timings);
		const player = new Animation(kEffect, document.timeline);

		cn.animPlayer = player;
	}
}

attachAnimations();
