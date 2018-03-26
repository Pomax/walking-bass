const easymidi  = require('easymidi'),
      PIANO = 'piano',
      DRUMS = 'drums',
      BASS = 'bass',
      INSTRUMENTS = [PIANO, DRUMS, BASS],
      OUTPUT_NAME = 'Nodejs MIDI out';

const PianoGenerator = require('./generators/piano'),
      DrumGenerator = require('./generators/drums'),
      BassGenerator = require('./generators/bass');

const nextChannel = (() => {
        let channel = 0;
        return () => channel++;
      })();

/**
 *
 */
class Track {
  constructor(manager, type, BPM) {
    this.manager = manager;
    this.type = type;
    this.channel = nextChannel(); // OFF BY ONE, since DAW count 1..., not 0...
    console.log(this.type, (this.channel+1));
    this.generator = this.setupGenerator(type, BPM);
  }

  setupGenerator(type, BPM) {
    switch(type) {
      case PIANO: return new PianoGenerator(this, BPM);
      case BASS: return new BassGenerator(this, BPM);
      case DRUMS: return new DrumGenerator(this, BPM);
    }
  }

  playNote(note, velocity=100, channel=this.channel) {
    let out = this.manager.output;
    let data = { note, velocity, channel };

    out.send('noteon', data);
    return () => out.send('noteoff', data);;
  }

  updateRoot(root) {
    this.manager.updateRoot(root);
  }

  play() { this.generator.play(); }

  pause() { this.generator.pause(); }

  stop() { this.generator.stop(); }
};


/**
 *
 */
class TrackManager {
  constructor(BPM) {
    this.bindOutput();
    this.tracks = INSTRUMENTS.map(name => new Track(this, name, BPM));
  }

  bindOutput() {
    if (process.platform === "win32") {
      var outputName = OUTPUT_NAME.toLowerCase();
      var outputs = easymidi.getOutputs();
      outputs.some(name => {
        let deviceName = name.toLowerCase();
        if (deviceName.indexOf(outputName) > -1) {
          return (this.output = new easymidi.Output(name));
        }
      });
    } else {
      this.output = new easymidi.Output(track.name, true);
    }
  }

  updateRoot(root) {
    this.currentRoot = root;
  }

  play() {
    this.tracks.forEach(t => t.play());
  }

  pause() {
    this.tracks.forEach(t => t.pause());
  }

  stop() {
    this.tracks.forEach(t => t.stop());
  }
};


module.exports = TrackManager;
