const power = document.getElementById('power');
const start = document.getElementById('start');
const strict = document.getElementById('strict');
const display = document.getElementById('display');
const outer = document.getElementById('outer');

const VICTORY_SEQUENCE = [[1,2],[0,3],[0,1,2,3]];
const FINAL_ROUND = 20, DELAY = 1000, LONG_DELAY = 1700;


const simonGame = new SequenceGame(corners.length);
let turnGenerator;

// turn whole game on/off
power.addEventListener("change", function (e) {
	console.log(this, "changed", this.checked);
	display.textContent = this.checked ? "--" : "";
	outer.classList.toggle("on", this.checked);

	simonGame.stop();
	stopAnimations();
});

// strict mode on/off
strict.addEventListener("change", function (e) {
	console.log(this, "changed", this.checked);
});

// start and restart game
start.addEventListener("click", function (e) {
	simonGame.stop();

	stopAnimations();

	setTimeout(startGame.bind(null, true), DELAY);
});

function userTurn(ind) {
	const {value, done} = turnGenerator.next(ind);
	console.log("generator's yield:", {value, done});
	if(done) {
		// round ended
		if(value === false) {
			// mismatch
			if(strict.checked) {
				simonGame.stop();
				display.textContent = "!!";
				// restart from round 1
				errorSound.play().then(()=>setTimeout(startGame.bind(null, true), LONG_DELAY));
			} else {
				simonGame.pause();
				display.textContent = "!!";
				// restart current round
				errorSound.play().then(()=>setTimeout(startGame, LONG_DELAY));
			}

			return false;
		} else if(value === FINAL_ROUND + 1) {
			// finished round 20 => victory
			simonGame.stop();

			setTimeout(playVictorySequence, DELAY);
		} else {
			simonGame.pause();
			// start next round after a delay;
			setTimeout(startGame, LONG_DELAY);
		}
	}

	return true;
}

function startGame(reset = false) {
	console.log("STARTING round", simonGame.round);
	if(reset) simonGame.reset();

	display.textContent = simonGame.round < 10 ? "0" + simonGame.round : simonGame.round;

	animateChain2(...simonGame.sequence).then((res) => {
		console.log("RES", res);
		if(res && res.interrupted) return;
		if(reset) simonGame.start();
		else simonGame.resume();
		console.log("RESUMING");

		turnGenerator = simonGame.play();
	});
}

function playVictorySequence() {
	animateChain2(...VICTORY_SEQUENCE);
	let rounds = FINAL_ROUND;
	const interval = setInterval(() => {
		if(--rounds === 0) {
			display.textContent = "--";
			clearInterval(interval);
			return;
		}
		display.textContent = rounds < 10 ? "0" + rounds : rounds;
	}, ANIMATION_DURATION * VICTORY_SEQUENCE.length / FINAL_ROUND);
}
