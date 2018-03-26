const theory = require('./music-theory.js');

class Generator {
  constructor(track, BMP) {
    let tick = 60000/BMP;

    // straight intervals
    this.intervals = {
       '1': tick << 2,
       '2': tick << 1,
       '4': tick,
       '8': tick >> 1,
      '16': tick >> 2,
      '32': tick >> 3,
      '64': tick >> 3,
    }

    // dotted intervals
    for(let i=0; i<7; i++) {
      let v = 1 << i;
      this.intervals[v + '.'] = 1.5 * this.intervals[v];
    }

    this.track = track;
    this.stepCounter = 0;
    this.program = [];
    this.step = {
      duration: 0,
      stop: ()=>{}
    };
  }

  playStep(step) {
    let notes = step.notes || [],
        duration = step.duration || 0,
        arpeggiated = step.arpeggiated || false,
        arp = step.arp || 0;

    if(typeof step.note === 'function') {
      notes = step.note();
    }

    if (!notes.forEach) {
      notes = [notes];
    }

    if (step.additional) {
      notes = notes.concat(step.additional);
    }

    // update the step for subclass code
    step.notes = notes;

    if (!arpeggiated) {
      let stops = notes.map(note => this.track.playNote(note));
      step.stop = () => stops.forEach(s => s());
      return;
    }

    let offset = 0;
    notes.forEach(note => {
      setTimeout(() => this.track.playNote(note), offset);
      offset += arp;
    });
  }

  stopPreviousStep() {
    this.step.stop();
  }

  playProgramStep() {
    this.stopPreviousStep();
    let len = this.program.length;
    let step = this.step = this.program[this.stepCounter++];
    if (this.stepCounter >= len) { this.stepCounter = 0; }
    if (step) { this.playStep(step); }
  }

  tick() {
    var now = Date.now();
    var ms = now - this.last;
    if (ms >= this.step.duration) {
      this.last = now;
      this.playProgramStep();
    }
    if (!this.stop) setTimeout(() => this.tick(), 1);
  }

  play() {
    this.stop = false;
    this.last = Date.now();
    this.tick();
  }

  pause() {
    this.stop();
  }

  stop() {
    this.stop = true;
  }
};

Generator.makeStep = function(options) {
  let note = options.note = theory.nameToNumber(options.note);
  if (options.chord) {
    let root = options.root = options.note;
    console.log(options.chord);
    options.notes = theory.chord(root, options.chord, options.inversion);
  }
  if (options.additional) {
    options.additional = options.additional.map(theory.nameToNumber);
  }
  return options;
}

Generator.makeRest = function(duration=0) {
  return { rest: true, duration };
};


module.exports = Generator;
