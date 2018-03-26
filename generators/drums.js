const Generator = require('./generator');

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
  play() {}
};

module.exports = DrumGenerator;
