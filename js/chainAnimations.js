
// finished Promise doesn't resolve when expected
// due to a bug in web-animation-js, issue#62
function animateChain(...cornerNumbers) {
	console.log("NUMBERS", cornerNumbers);
	corners[cornerNumbers[0]].animPlayer.play();
	let promise = corners[cornerNumbers[0]].animPlayer.finished;

	for(let i = 1, len = cornerNumbers.length; i < len; ++i) {
		const cn = corners[cornerNumbers[i]];
		promise = promise.then(() => {
			console.log("START ON", cn);
			cn.animPlayer.play();
			return cn.animPlayer.finished;
		});
	}

	return promise;
}

let animationStopped;
function animateChain2(...cornerNumbers) {
	animationStopped = false;
	// immediately resolved promise
	let chainPromise = Promise.resolve();

	// chain promises that will get resolved on animation finish
	for(let nums of cornerNumbers) {
		if(!Array.isArray(nums)) {
			nums = [nums];
		} else {
			// filter out duplicates
			nums = nums.filter((el, i, a) => a.indexOf(el) === i);
		}
		const players = nums.map((n) => {
			const {animPlayer, soundPlayer} = corners[n];
			return {animPlayer, soundPlayer};
		});
		// console.log("players", players);

		chainPromise = chainPromise.then(() => {
			if(animationStopped) {
				throw new Error("Animation interrupted");
			}

			const promises = [];
			for(let {animPlayer, soundPlayer} of players) {
				// console.log("PLAYING ANIM", animPlayer);
				animPlayer.play();
				// console.log("PLAYING SOUND", soundPlayer);
				soundPlayer.play();

				// asynchrously create next promise at the point when it's needed
				// creating all promises in the loop and then chaining wouldn't allow for same corner to appear twice
				// as .onfinish would get overwritten

				promises.push(new Promise(function (resolve) {
					animPlayer.onfinish = resolve;
				})	// reset finish event handler
				.then(() => animPlayer.onfinish = null));
			}

			return Promise.all(promises);
		});
	}

	return chainPromise.then(() => {return {finished: true};})
		.catch(err => {
			console.log(err);
			return {interrupted: true};
		});
}

function stopAnimations() {
	animationStopped = true;
	for(let anim of document.timeline.getAnimations()) {
		anim.finish();
		console.log("anim finished");
	}
}
