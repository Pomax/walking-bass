const Generator = require('./generator'),
      theory = require('./music-theory.js'),
      step = Generator.makeStep,
      rest = Generator.makeRest,
      note = theory.nameToNumber;

class PianoGenerator extends Generator {
  constructor(track, BMP) {
    super(track, BMP);
    this.program = this.getProgram();
  }

  playStep(step) {
    super.playStep(step);
    if (step.chord) {
      this.track.updateRoot(step.root);
      this.track.updateChord(step.chord, step.notes);
    }
  }

  getNextChord() {
    let next = this.stepCounter + 1;
    if (next >= this.program.length) { next = 0; }
    let step = this.program[next];
    let notes = step.notes;
    if (step.additional) {
      notes = notes.concat(step.additional);
    }
    return notes;
  }

  getProgram() {
    // Bb7 | Bdim7 | F7/C Bbm7 | Am7     D7  |
    // Gm7 |   C7  | F7   Fm7  | Abdim7 F7/A |
    let q = this.intervals[1];

    return [
      step({ note: 'Bb3', chord:    '7', duration: q }),
      step({ note: 'Bb3', chord: 'dim7', duration: q }),
      step({ note:  'F3', chord:    '7', duration: q/2, additional: ['C3'] }),
      step({ note: 'Bb3', chord:   'm7', duration: q/2 }),
      step({ note:  'A3', chord:   'm7', duration: q/2 }),
      step({ note: 'Ab3', chord:   'm7', duration: q/2 }),

      step({ note:  'G3', chord:   'm7', duration: q }),
      step({ note:  'C3', chord: 'dom7', duration: q }),
      step({ note:  'F3', chord:    '7', duration: q/2 }),
      step({ note:  'F3', chord:   'm7', duration: q/2 }),
      step({ note: 'Ab3', chord: 'dim7', duration: q/2 }),
      step({ note:  'E3', chord:    '9', duration: q/2}),
    ]
  }

};

module.exports = PianoGenerator;
