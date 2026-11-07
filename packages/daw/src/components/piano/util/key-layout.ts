import {
  MIDI_NOTE_COUNT,
  MAX_MIDI_NOTE,
  KEY_HEIGHT,
  NOTE_NAMES,
  BLACK_KEY_PITCH_CLASSES,
} from "../constants";

/** Middle C (60) is C4, so note 0 is C-1. */
export function octave(note: number) {
  return Math.floor(note / 12) - 1;
}

export function isBlackKey(note: number) {
  return BLACK_KEY_PITCH_CLASSES.has(note % 12);
}

export function isC(note: number) {
  return note % 12 === 0;
}

export function noteName(note: number) {
  return `${NOTE_NAMES[note % 12]}${octave(note)}`;
}

/** Y offset in px of a note's row from the top of the keyboard. */
export function noteTop(note: number) {
  return (MAX_MIDI_NOTE - note) * KEY_HEIGHT;
}

/** Scroll position that vertically centers a note in a viewport of the given height. */
export function scrollTopForNote(note: number, viewportHeight: number) {
  const clamped = Math.min(MAX_MIDI_NOTE, Math.max(0, Math.round(note)));
  const centered = noteTop(clamped) + KEY_HEIGHT / 2 - viewportHeight / 2;
  const max = MIDI_NOTE_COUNT * KEY_HEIGHT - viewportHeight;
  return Math.min(Math.max(0, max), Math.max(0, centered));
}
