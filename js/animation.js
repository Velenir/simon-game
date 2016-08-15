const corners = document.querySelectorAll(".outer__corner");
const ANIMATION_DURATION = 1000;

function attachAnimations() {

	const timings = {
		duration: ANIMATION_DURATION
		// fill: 'both',
		// direction: 'alternate',
		// iterations: Infinity
	};

	const partialKeyframes = [
		{backgroundColor: "yellow", boxShadow: "0 0 10px white, inset 0 0 15px 2px gray"},
		{boxShadow: "0 0 10px white, inset 0 0 15px 10px gray"}
	];

	for(let i = 0, len = corners.length; i < len; ++i) {
		const cn = corners[i];

		const backgroundColor = getComputedStyle(cn).backgroundColor;

		const kEffect = new KeyframeEffect(cn, [partialKeyframes[0], Object.assign({}, partialKeyframes[1], {backgroundColor})], timings);
		const player = new Animation(kEffect, document.timeline);

		cn.animPlayer = player;

		cn.soundPlayer = new Audio(`https://s3.amazonaws.com/freecodecamp/simonSound${i+1}.mp3`);

		cn.onmousedown = cornerClicked;

		cn.ind = i;
	}
}

attachAnimations();


function cornerClicked() {
	// only animate if game is in progress
	if(!simonGame.on) return;

	// don't play corner.sound if wrong user input
	if(!userTurn(this.ind)) return;

	if(this.animPlayer.playState === "running") this.animPlayer.cancel();
	this.animPlayer.play();

	this.soundPlayer.currentTime = 0;
	this.soundPlayer.play();
}
