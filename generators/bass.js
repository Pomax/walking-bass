const Generator = require('./generator'),
      theory = require('./music-theory.js'),
      getRandomElement = require('../get-random-element'),
      exclude = require('../array-exclude'),
      step = Generator.makeStep,
      rest = Generator.makeRest;

class BassGenerator extends Generator {
  constructor(track, BPM) {
    super(track, BPM);

    let q = this.intervals[16];

    this.program = [
      step({
        note: () => this.generateBassNote(),
        duration: 2*q,
      }),
      rest(2*q),

      step({
        note: () => this.generateBassNote(),
        duration: 2*q,
      }),
      rest(2*q),

      step({
        note: () => this.generateBassNote(),
        duration: 2*q,
      }),
      rest(2*q),

      step({
        note: () => this.generateBassNote(),
        duration: 2*q,
      }),
      rest(2*q),
    ];
  }

  generateBassNote() {
    let notes = this.track.manager.currentChordNotes;

    // first note is the root, most of the time.
    if (this.stepCounter === 1) {
      if (Math.random() < 0.8) return notes[0];
      return getRandomElement(notes);
    }

    // any note in the chord, or chord scale
    if (this.stepCounter === 3 || this.stepCounter === 5) {
      return getRandomElement(notes);
    }

    // leading note to the next chord. This one is tricky
    // unless we ask the piano for the next chord.
    if (this.stepCounter === 7) {
      let nextChord = this.track.manager.getNextChord();
      let exclusion = exclude(nextChord, notes);
      return getRandomElement(exclusion);
    }

    // generally we don't want to be able to get here.
    return notes[0];
  }
};

module.exports = BassGenerator;
