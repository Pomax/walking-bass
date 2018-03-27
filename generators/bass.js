const Generator = require('./generator'),
      theory = require('./music-theory.js'),
      getRandomElement = require('./utils/get-random-element'),
      exclude = require('./utils/array-exclude'),
      step = Generator.makeStep,
      rest = Generator.makeRest;

class BassGenerator extends Generator {
  constructor(track, BPM) {
    super(track, BPM);
    this.program = this.getProgram();
    this.history = [0,0,0,0];
  }

  getProgram() {
    let q = this.intervals['8.'],
        r = this.intervals[16];
    return [
      step({
        note: (step) => this.generateBassNote(step),
        duration: q,
        beat: 1,
      }),
      rest(r),

      step({
        note: (step) => this.generateBassNote(step),
        duration: q,
        beat: 2,
      }),
      rest(r),

      step({
        note: (step) => this.generateBassNote(step),
        duration: q,
        beat: 3,
      }),
      rest(r),

      step({
        note: (step) => this.generateBassNote(step),
        duration: q,
        beat: 4,
      }),
      rest(r),
    ];
  }

  generateBassNote(step, depth=0) {
    let notes = this.track.manager.currentChordNotes;
    let bassNote = notes[0];

    // first note is the root, most of the time.
    if (step.beat === 1) {
      if (Math.random() < 0.2) {
        bassNote = getRandomElement(notes);
      }
    }

    // any note in the chord, or chord scale
    if (step.beat === 2 || step.beat === 3) {
      bassNote = getRandomElement(notes);
    }

    // leading note to the next chord. This one is tricky
    // unless we ask the piano for the next chord.
    if (step.beat === 4) {
      let nextChord = this.track.manager.getNextChord();
      let exclusion = exclude(nextChord, notes);
      bassNote = getRandomElement(exclusion);
    }

    if (this.history.indexOf(bassNote) > -1) {
      if (depth<4) {
        bassNote = this.generateBassNote(step, depth+1);
      }
    }

    this.history.splice(0,1);
    this.history.push(bassNote)

    // generally we don't want to be able to get here.
    return bassNote;
  }
};

module.exports = BassGenerator;
