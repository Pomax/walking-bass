const offset = note => (v => note + v);

// MIDI notes use numbers, which are inconvenient.

const notes = {
  'Cb': -1,
   'C':  0,
  'C#':  1,
  'Db':  1,
   'D':  2,
  'D#':  3,
  'Eb':  3,
   'E':  4,
  'E#':  5,
  'Fb':  4,
   'F':  5,
  'F#':  6,
  'Gb':  6,
   'G':  7,
  'G#':  8,
  'Ab':  8,
   'A':  9,
  'A#': 10,
  'Bb': 10,
   'B': 11,
  'B#': 12,
}

const octaves = {
  '-1': 0,
   '0': 12,
   '1': 24,
   '2': 36,
   '3': 48,
   '4': 60,
   '5': 72,
   '6': 84,
   '7': 96,
   '8': 108,
   '9': 120,
}

function nameToNumber(name) {
  if (name == name<<0) return name;
  let note, octave;
  name.replace(/(\D+)(\d+)/, function(_, n, o) {
    note = n;
    octave = o;
  });
  return notes[note] + octaves[octave];
}

// Those names you can never remember...
const modes = {
  ionian:     [0,2,4,5,7,9,11,12],
  dorian:     [0,2,3,5,7,9,10,12],
  phrygian:   [0,1,3,5,7,8,10,12],
  lydian:     [0,2,4,6,7,9,11,12],
  mixolydian: [0,2,4,5,7,9,10,12],
  aeolian:    [0,2,3,5,7,8,10,12],
  locrian:    [0,1,3,5,6,8,10,12],
};

// "Don't worry about it, it's just a straight I-VI-II-IV".
const tonics = modes.ionian;

// The tools we use to harmonize music.
const chords = {
        m: [0,3,7],
      dim: [0,3,6],
      maj: [0,4,7],
      aug: [0,4,8],

     sus2: [0,2,7],
     sus4: [0,5,7],
  '9sus4': [0,5,7,10,13],

     dim7: [0,3,6,9],
     m7b5: [0,3,6,10],
       m7: [0,3,7,10],
    mmaj7: [0,3,7,11],
     dom7: [0,4,7,10],
     maj7: [0,4,7,11],
     aug7: [0,4,8,10],
  augmaj7: [0,4,8,11],

      '2': [0,4,7,14],
      '4': [0,4,7,17],
      '6': [0,4,7,9],
    '6/9': [0,4,7,9,14],
    '7/6': [0,4,7,9,10],
       m9: [0,3,7,10,14],
      '9': [0,4,7,10,14],
      m11: [0,3,7,10,14,17],
     '11': [0,4,7,10,14,17],
      m13: [0,3,7,10,14,17,21],
     '13': [0,4,7,10,14,17,21],
};

function invert(notes, shift) {
  console.log(shift, notes.slice());

  if (!shift) return notes;

  if (shift < 0) {
    while(shift++ > 0) {
      notes.unshift(notes.pop() - 12);
    }

  }

  if (shift > 0) {
    while(shift-- > 0) {
      notes.push(notes.shift() + 12);
    }
  }

  console.log(notes.slice());

  return notes;
}

// if (require.main === module) {
//   let name = 'C#6';
//   let number = nameToNumber(name);
//   console.log(name, number);
// }

module.exports = {
  notes,
  octaves,
  nameToNumber,

  modes,
  mode: (note, mode) => modes[mode].map(offset(nameToNumber(note))),

  tonics,
  tonic: (note, number) => tonics.map(offset(nameToNumber(note)))[number],

  chords,
  invert,
  chord: (note, type, inversion=0) => invert(chords[type].map(offset(nameToNumber(note))), inversion),
};
