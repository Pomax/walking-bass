const Track = require('./track');

/**
 *
 */
class TrackManager {
  constructor(BPM) {
    // Note that this binding here + tick computation locks all
    // tracks into the same BPM, so we don't get polyrhythm for
    // free in the current implementation. We'd have to give each
    // track its own wall-clock based tick computer for that.
    this.BPM = BPM;
    this.tracks = Track.getInstruments().map(name => new Track(this, name, BPM));
  }

  updateRoot(root) {
    this.currentRoot = root;
  }

  updateChord(chord, notes) {
    this.currentChord = chord;
    this.currentChordNotes = notes;
  }

  getCurrentChordStep() {
    let piano = this.tracks[1].generator;
    return piano.getCurrentChordStep ? piano.getCurrentChordStep(): [];
  }

  getNextChordStep() {
    let piano = this.tracks[1].generator;
    return piano.getNextChordStep ? piano.getNextChordStep(): [];
  }

  tick() {
    if (!this.playing) return;
    let diff = Date.now() - this.start;
    let tickCount = this.tickCount = ((diff*this.BPM*32)/60000)|0;
    this.tracks.forEach(t => t.tick(this.tickCount));
    setTimeout(() => this.tick(), 2);
  }

  play() {
    this.tickCount = 0;
    this.playing = true;
    this.start = Date.now();
    this.tick();
  }

  pause() {
    this.playing = false;
  }

  stop() {
    this.pause();
  }
};


module.exports = TrackManager;
