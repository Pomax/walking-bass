const easymidi  = require('easymidi'),
      PIANO = 'piano',
      DRUMS = 'drums',
      BASS = 'bass',
      INSTRUMENTS = [DRUMS, PIANO, BASS], // drums need to be 1 because of Strike...
      OUTPUT_NAME = 'Nodejs MIDI output';

const PianoGenerator = require('./generators/piano'),
      DrumGenerator = require('./generators/drums'),
      BassGenerator = require('./generators/bass');

const midiChannel = v => v-1;

/**
 *
 */
class Track {
  constructor(manager, type, BPM) {
    this.manager = manager;
    this.type = type;
    this.channel = midiChannel(1); // for now
    this.bindOutput();
    this.generator = this.setupGenerator(type, BPM);
  }

  bindOutput() {
    let outputName = `${OUTPUT_NAME} ${this.type}`.toLowerCase();
    if (process.platform === "win32") {
      var outputs = easymidi.getOutputs();
      outputs.some(name => {
        let deviceName = name.toLowerCase();
        if (deviceName.indexOf(outputName) > -1) {
          return (this.output = new easymidi.Output(name));
        }
      });
    } else {
      this.output = new easymidi.Output(outputName, true);
    }
  }

  setupGenerator(type, BPM) {
    switch(type) {
      case PIANO: return new PianoGenerator(this, BPM);
      case DRUMS: return new DrumGenerator(this, BPM);
      case BASS: return new BassGenerator(this, BPM);
    }
  }

  playNote(note, velocity=100, channel=this.channel) {
    let out = this.output;
    let data = { note, velocity, channel };

    out.send('noteon', data);
    return () => out.send('noteoff', data);;
  }

  updateRoot(root) {
    this.manager.updateRoot(root);
  }

  updateChord(chord, notes) {
    this.manager.updateChord(chord, notes);
  }

  tick(tickCount) { this.generator.tick(tickCount); }
};


/**
 *
 */
class TrackManager {
  constructor(BPM) {
    this.tracks = INSTRUMENTS.map(name => new Track(this, name, BPM));
    this.v128 = 60000/(BPM*32);
  }

  updateRoot(root) {
    this.currentRoot = root;
  }

  updateChord(chord, notes) {
    this.currentChord = chord;
    this.currentChordNotes = notes;
  }

  getNextChord() {
    let piano = this.tracks[1].generator;
    return piano.getNextChord ? piano.getNextChord(): [];
  }

  tick() {
    if (!this.playing) return;
    let diff = Date.now() - this.start;
    let tickCount = this.tickCount = (diff/this.v128)|0;
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
