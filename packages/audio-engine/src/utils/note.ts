import type { Note, MidiNote } from "../types/note";

const LETTER_TO_SEMITONE: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const ACCIDENTAL_TO_OFFSET: Record<string, number> = {
  bb: -2,
  b: -1,
  "": 0,
  "#": 1,
  x: 2,
};

const SEMITONE_TO_NOTE: Record<number, string> = {
  0: "C",
  1: "C#",
  2: "D",
  3: "D#",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "G#",
  9: "A",
  10: "A#",
  11: "B",
};

export function noteToMidiNote(note: Note): MidiNote {
  const match = note.match(/^([A-G])(bb|b|#|x)?(-?\d+)$/);
  if (!match) throw new Error(`Invalid note: ${note}`);

  const [, letter, accidental = "", octaveStr] = match;
  const octave = parseInt(octaveStr, 10);

  const semitoneInOctave = LETTER_TO_SEMITONE[letter] + ACCIDENTAL_TO_OFFSET[accidental];
  const midiNote = (octave + 1) * 12 + semitoneInOctave;

  return midiNote as MidiNote;
}

export function midiNoteToNote(midiNote: MidiNote): Note {
  const octave = Math.floor(midiNote / 12) - 1;
  const semitoneInOctave = midiNote % 12;

  return `${SEMITONE_TO_NOTE[semitoneInOctave]}${octave}` as Note;
}
