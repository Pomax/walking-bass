const Generator = require('./generator'),
      step = Generator.makeStep,
      rest = Generator.makeRest;

/**
 * For the drum section, we very specifically
 * want the "Strike" VSTi, made by AIR.
 * This is a pattern player with control over
 * the pattern, the intensity, and the complexity,
 * without having to cue individual notes.
 * This makes playing variations and ramping
 * the rhythm up/down very easy.
 */
class DrumGenerator extends Generator {
  getProgram() {
    let q = 4 * this.intervals[1];
    return [
      step({
        note: 'C2',
        duration: 0,
      }),
      step({
        note: 'A2',
        duration: 3*q,
      }),
      step({
        note: 'A#3',
        duration: q,
      }),
      step({
        note: 'A3',
        duration: 3*q,
      }),
      step({
        note: 'A#3',
        duration: q,
      }),
    ];
  }
};

module.exports = DrumGenerator;
