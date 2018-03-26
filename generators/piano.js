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
      step(theory.chord(note('D3'), 'm9'), note('D3'), 3*q),
      step(theory.chord(note('D3'), 'm9'), note('D3'), 1*q),
      rest(4*q),

      step(theory.chord(note('G2'), '9', 2), note('G3'), 3*q),
      step(theory.chord(note('G2'), '9', 2), note('G3'), 1*q),
      rest(4*q),

      step(theory.chord(note('C3'), '6/9'), note('C3'), 3*q),
      step(theory.chord(note('C3'), '6/9'), note('C3'), 1*q),
      rest(4*q),

      step([].concat(
        theory.chord(note('C3'), 'maj'),
        theory.chord(note('C4'), 'maj')
      ), note('C3'), 3*q),
      step([].concat(
        theory.chord(note('C3'), 'maj'),
        theory.chord(note('C4'), 'maj')
      ), note('C3'), 1*q),
      rest(4*q),
    ];
  }

  playStep(step) {
    super.playStep(step);
  }

};

module.exports = PianoGenerator;
