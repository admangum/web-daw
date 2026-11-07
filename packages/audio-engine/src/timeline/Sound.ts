import type { MidiNote } from "../types/note";

export interface SoundOptions {
  id: string;
  clipId: string;
  /** Position on the timeline, in seconds. */
  startTime: number;
  /** Duration of the clip as placed on the timeline, in seconds. */
  duration: number;
  /** Offset into the source buffer where playback should begin, in seconds. */
  offset?: number;

  midiNote: MidiNote;
}

export class Sound {
  readonly id: string;
  clipId: string;
  startTime: number;
  duration: number;
  offset: number;
  midiNote: MidiNote;

  constructor(options: SoundOptions) {
    this.id = options.id;
    this.clipId = options.clipId;
    this.startTime = options.startTime;
    this.duration = options.duration;
    this.offset = options.offset ?? 0;
    this.midiNote = options.midiNote;
  }

  get endTime(): number {
    return this.startTime + this.duration;
  }

  overlaps(other: Sound): boolean {
    return this.startTime < other.endTime && other.startTime < this.endTime;
  }
}
