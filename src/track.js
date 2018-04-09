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

  cleanup() {
    this.generator.cleanup();
  }

  notify(data) {
    this.manager.notify(this.type, data);
  }

  playNote(note, delay=0, velocity=100, channel=this.channel) {
    let out = this.output;
    let data = { note, velocity, channel };
    let play = () => out.send('noteon', data);
    let stop = () => out.send('noteoff', data);
    if (!delay) { play(); } else { setTimeout(play, delay); }
    return stop;
  }

  updateRoot(root) {
    this.manager.updateRoot(root);
  }

  updateChord(chord, notes) {
    this.manager.updateChord(chord, notes);
  }

  tick(tickCount) { this.generator.tick(tickCount); }
};

Track.getInstruments = () => INSTRUMENTS;

module.exports = Track;
