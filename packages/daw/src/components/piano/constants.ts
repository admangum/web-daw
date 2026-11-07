export const MIDI_NOTE_COUNT = 128;
export const MAX_MIDI_NOTE = MIDI_NOTE_COUNT - 1;

/** Height in px of one semitone row. Shared so a piano roll can align note rows to keys. */
export const KEY_HEIGHT = 20;

export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const BLACK_KEY_PITCH_CLASSES = new Set([1, 3, 6, 8, 10]);

/** Notes in render order: highest pitch first, so it sits at the top. */
export const NOTES_TOP_DOWN = Array.from({ length: MIDI_NOTE_COUNT }, (_, i) => MAX_MIDI_NOTE - i);
