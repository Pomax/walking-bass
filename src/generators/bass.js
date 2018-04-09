with(Math) {

  const Generator = require('./generator'),
        getRandomElement = require('./utils/get-random-element'),
        exclude = require('./utils/array-exclude'),
        step = Generator.makeStep,
        rest = Generator.makeRest;

  class BassGenerator extends Generator {
    constructor(track, BPM) {
      super(track, BPM);
      this.history = [0,0,0,0];
      this.bassNote = false;
    }

    getProgram() {
      let q = this.intervals['8.'],
          r = this.intervals[16];

      let steps = [];
      for (let i=1; i<=4; i++) {
        // normal bass note
        steps.push(step({ note: (step) => this.generateBassNote(step), duration: q, beat: i }));
        // possible ghost note
        steps.push(step({ note: (step) => this.generateGhostNote(step), duration: r, beat: i + 0.5 }));
      }

      return steps;
    }

    getNoteNear(current, list) {
      // Sort the list of notes to pick from based on how
      // close they are to the current note.
      list = list.sort((a,b) => {
        let d1 = abs(a - current);
        let d2 = abs(b - current);
        return d2 - d1;
      }).filter(v => v!==0);

      // Pick a random note from that list, but skew it so that
      // we end up picking lower index elements over higher
      // index elements:
      let idx = floor(log((random()*(pow(2.0, list.length)-1.0)) + 1.0) / log(2.0));
      return list[idx];
    }

    generateGhostNote(step) {
      return false;

      let beat = step.beat;
      if (beat < 4 && Math.random() > 0.1) return false;
      if (beat >= 4 && Math.random() > 0.7) return false;

      let current = this.track.manager.getCurrentChordStep();
      let notes = current.notes.concat(current.addition || []);
      if (Math.random() > 0.5) {
        if (beat < 4) return this.getNoteNear(this.bassNote, notes);
        else {
          // whole or half step from next target root
          let next = this.track.manager.getNextChordStep();
          let nextChord = next.notes.concat(next.additional || []);
          let nextRoot = nextChord[0];
          if (this.bassNote < nextRoot) {
            return Math.random() < 0.5 ? nextRoot - 2 : nextRoot - 1;
          }
          if (this.bassNote > nextRoot) {
            return Math.random() < 0.5 ? nextRoot + 2 : nextRoot + 1;
          }
        }
      }
      if (Math.random() > 0.5) return [this.bassNote + 4];
      if (Math.random() > 0.5) return [this.bassNote + 6];
      if (Math.random() > 0.5) return [this.bassNote + 12];
    }

    generateBassNote(step, depth=0) {
      let current = this.track.manager.getCurrentChordStep();
      let notes = current.notes.concat(current.addition || []);
      let next = this.track.manager.getNextChordStep();
      let bassNote = notes[0];

      // first note is the root, most of the time.
      if (step.beat === 1) {
        // no work for now
      }

      // any note in the chord, or chord scale
      if (step.beat === 2 || step.beat === 3) {
        bassNote = this.getNoteNear(this.bassNote, notes);
      }

      // leading note to the next chord. This one is tricky
      // unless we ask the piano for the next chord.
      if (step.beat === 4) {
        let nextChord = next.notes.concat(next.additional || []);
        let exclusion = exclude(nextChord, notes);
        bassNote = this.getNoteNear(this.bassNote, exclusion);
      }

      // Make sure we don't repeat ourselves for some fixed
      // history length
      if (this.history.indexOf(bassNote) > -1) {
        if (depth<this.history.length) {
          bassNote = this.generateBassNote(step, depth + 1);
        }
      }
      // slide the history window to the current note
      this.history.splice(0,1);
      this.history.push(bassNote)

      // and we're done
      this.bassNote = bassNote;
      return [bassNote];
    }
  };

  module.exports = BassGenerator;

}
