const chainAnimations = (function (objects) {


	// finished Promise doesn't resolve when expected
	// due to a bug in web-animation-js, issue#62
	function animateChain(...objectNumbers) {
		console.log("NUMBERS", objectNumbers);
		objects[objectNumbers[0]].animPlayer.play();
		let promise = objects[objectNumbers[0]].animPlayer.finished;

		for(let i = 1, len = objectNumbers.length; i < len; ++i) {
			const cn = objects[objectNumbers[i]];
			promise = promise.then(() => {
				console.log("START ON", cn);
				cn.animPlayer.play();
				return cn.animPlayer.finished;
			});
		}

		return promise;
	}

	let animationStopped;
	function animateChain2(...objectNumbers) {
		animationStopped = false;
		// immediately resolved promise
		let chainPromise = Promise.resolve();

		// chain promises that will get resolved on animation finish
		for(let nums of objectNumbers) {
			if(!Array.isArray(nums)) {
				nums = [nums];
			} else {
				// filter out duplicates
				nums = nums.filter((el, i, a) => a.indexOf(el) === i);
			}
			const players = nums.map((n) => {
				const {animPlayer, soundPlayer} = objects[n];
				return {animPlayer, soundPlayer};
			});

			chainPromise = chainPromise.then(() => {
				if(animationStopped) {
					throw new Error("Animation interrupted");
				}

				const promises = [];
				for(let {animPlayer, soundPlayer} of players) {
					animPlayer.play();
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

	return {animateChain, animateChain2, stopAnimations};
})(corners);
