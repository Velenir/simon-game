class SequenceGame {
	constructor(variants, startingRound = 1, variantsPerRound = 1) {
		this.on = false;
		this.startingRound = startingRound;
		this.variantsPerRound = variantsPerRound;
		this.variants = variants;

		this.reset();
	}

	start() {
		this.on = true;
	}

	stop() {
		this.on = false;
		this.round = this.startingRound;
	}

	reset() {
		this.on = false;
		this.round = this.startingRound;
		this.sequence = this._generateSequence();
	}

	pause() {
		this.on = false;
	}

	resume() {
		this.on = true;
	}

	_generateSequence(roundN = this.round, variantsPerRound = this.variantsPerRound) {
		return Array.from({length: roundN * variantsPerRound}, this._getRandomVariant, this);
	}

	_getRandomVariant() {
		return Math.floor(Math.random() * this.variants);
	}

	_addToSequence() {
		for(let i = 0; i < this.variantsPerRound; ++i) {
			this.sequence.push(this._getRandomVariant());
		}
	}

	play() {
		const gen = this._turnGenerator();
		// go to first yield
		gen.next();
		return gen;
	}

	*_turnGenerator() {
		for(let n of this.sequence) {
			console.log("BEFORE yield");
			const userN = yield;
			console.log("AFTER yield");
			console.log("n:", n, ", userN:", userN, n === userN);
			if(userN !== n) return false;
		}

		this._addToSequence();
		return ++this.round;
	}
}
