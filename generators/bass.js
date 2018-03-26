const Generator = require('./generator'),
      theory = require('./music-theory.js'),
      step = Generator.makeStep,
      rest = Generator.makeRest;

class BassGenerator extends Generator {
  constructor(track, BPM) {
  	super(track, BPM);

    let q = this.intervals[16];

	this.program = [
	  step(() => this.generateBassNote(), false, 2*q),
	  rest(2*q)

	  step(() => this.generateBassNote(), false, 2*q),
	  rest(2*q)

	  step(() => this.generateBassNote(), false, 2*q),
	  rest(2*q)

	  step(() => this.generateBassNote(), false, 2*q),
	  rest(2*q)
    ];
  }

  generateBassNote() {
  	let root = this.track.manager.currentRoot;
  	let bassNote = root;

  	if (this.stepCounter === 0) {
  		// first note is the root
  	    bassNote = root;
  	}

  	if (this.stepCounter === 2 || this.stepCounter === 3) {
  		// any note in the chord, or chord scale
  	    bassNote = root;
  	}

  	if (this.stepCounter === 4) {
  		// leading note to the next chord. This one is tricky
  		// unless we ask the piano for the next chord.
  	    bassNote = root;
  	}

  	return bassNote;
  }
};

module.exports = BassGenerator;
