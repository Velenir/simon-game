
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

let stopped;
function animateChain2(...cornerNumbers) {
	stopped = false;
	// immediately resolved promise
	let chainPromise = Promise.resolve();

	// chain promises that will get resolved on animation finish
	for(let num of cornerNumbers) {
		const player = corners[num].animPlayer;

		chainPromise = chainPromise.then(() => {
			if(stopped) {
				console.log("STOPPED BEFORE", player.effect.target);
				throw new Error("Animation interrupted");
			}
			console.log("START ON", player.effect.target);
			// previous promise resolved, start next animation
			player.play();

			// asynchrously create next promise at the point when it's needed
			// creating all promises in the loop and then chaining wouldn't allow for same corner to appear twice
			// as .onfinish would get overwritten
			return new Promise(function (resolve) {
				player.onfinish = resolve;
			})	// reset finish event handler
			.then(() => player.onfinish = null);
		});
	}

	// start the chain
	corners[cornerNumbers[0]].animPlayer.play();

	return chainPromise.catch(err => console.log(err));
}

function stopAnimations() {
	stopped = true;
	for(let anim of document.timeline.getAnimations()) {
		anim.finish();
		console.log("anim finished");
	}
}
