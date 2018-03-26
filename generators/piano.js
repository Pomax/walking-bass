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
  }

};

module.exports = PianoGenerator;
