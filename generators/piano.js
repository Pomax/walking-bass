const Generator = require('./generator'),
      theory = require('./music-theory.js'),
      step = Generator.makeStep,
      rest = Generator.makeRest,
      note = theory.nameToNumber;

class PianoGenerator extends Generator {
  constructor(track, BMP) {
    super(track, BMP);

    let q = this.intervals[8];

    this.program = [
      step({
        note: 'D3',
        chord: 'm9',
        duration: q*3
      }),
      step({
        note: 'D3',
        chord: 'm9',
        duration: q
      }),
      rest(4*q),

      step({
        note: 'G2',
        chord: '9',
        inversion: 2,
        duration: q*3
      }),
      step({
        note: 'G2',
        chord: '9',
        inversion: 2,
        duration: q
      }),
      rest(4*q),

      step({
        note: 'C3',
        chord: '6/9',
        duration: q*3
      }),
      step({
        note: 'C3',
        chord: '6/9',
        duration: q
      }),
      rest(4*q),

      step({
        note: 'C3',
        additional: theory.chord(note('C4'), 'maj'),
        chord: 'maj',
        duration: q*3
      }),
      step({
        note: 'C3',
        additional: theory.chord(note('C4'), 'maj'),
        chord: 'maj',
        duration: q
      }),
      rest(4*q),
    ];
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

};

module.exports = PianoGenerator;
