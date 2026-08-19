export interface ClipOptions {
  id: string;
  trackId: string;
  /** Position on the timeline, in seconds. */
  startTime: number;
  /** Duration of the clip as placed on the timeline, in seconds. */
  duration: number;
  /** Offset into the source buffer where playback should begin, in seconds. */
  offset?: number;
  buffer: AudioBuffer;
}

export class Clip {
  readonly id: string;
  readonly trackId: string;
  startTime: number;
  duration: number;
  offset: number;
  buffer: AudioBuffer;

  constructor(options: ClipOptions) {
    this.id = options.id;
    this.trackId = options.trackId;
    this.startTime = options.startTime;
    this.duration = options.duration;
    this.offset = options.offset ?? 0;
    this.buffer = options.buffer;
  }

  get endTime(): number {
    return this.startTime + this.duration;
  }

  overlaps(other: Clip): boolean {
    return this.startTime < other.endTime && other.startTime < this.endTime;
  }
}
