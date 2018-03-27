const theory = require('./music-theory.js');

// basic timing intervals in terms of how many 'ticks' they run for.
const intervals = {
         '1': 128,
         '2': 64,
         '4': 32,
         '8': 16,
        '16': 8,
        '32': 4,
        '64': 2,
      };

// enrich with dotted intervals:
for(let i=0; i<7; i++) {
  let v = 1 << i;
  intervals[v + '.'] = 1.5 * intervals[v];
}


class Generator {
  constructor(track, BMP) {
    this.track = track;
    this.stepCounter = 0;
    this.step = {
      note: 'C2',
      duration: 0,
      end: 0,
      stop: ()=>{}
    };
    this.program = [this.step];
    this.intervals = intervals;
  }

  playStep(step) {
    let notes = step.notes || [],
        duration = step.duration || 0,
        arpeggiated = step.arpeggiated || false,
        arp = step.arp || 0;

    if(typeof step.note === 'function') {
      notes = step.note(step);
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

  stopPreviousStep(tickCount) {
    this.step.stop();
    return tickCount - this.step.end;
  }

  setNextStep() {
    let len = this.program.length;
    this.step = this.program[this.stepCounter++];
    if (this.stepCounter >= len) { this.stepCounter = 0; }
    return this.step;
  }

  playProgramStep(tickCount) {
    // Integer BPM is virtually guaranteed to require
    // fractional millisecond timeouts, which we can't
    // work with in JavaScript. Instead, we need to check
    // if we 'skipped over' a tick to the one after, and
    // in those cases, correct the play length for the
    // next step by that many ticks.
    //
    // Note that without syncing to a DAW, there will
    // still be small amounts of drift that become 
    // noticable after about a minute of play, so any
    // infinite-loop-based instrument should probably
    // be "reset" for now. See the drum pattern for 
    // an example of this, where C2 is the 'stop'
    // instruction to Strike 2.
    let correction = this.stopPreviousStep(tickCount);
    let step = this.setNextStep();
    if (step) {
      step.end = tickCount + step.duration - correction;
      this.playStep(step);
    }
  }

  tick(tickCount) {
    if (this.step.end <= tickCount) {
      this.playProgramStep(tickCount);
    }
  }
};

Generator.makeStep = function(options) {
  let note = options.note = theory.nameToNumber(options.note);
  if (note && !options.notes) {
    options.notes = [note];
  }
  if (options.chord) {
    let root = options.root = options.note;
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
