import type { Transport } from "../transport/Transport";
import type { Track } from "../track/Track";
import type { Clip } from "./Clip";
import { BufferSource } from "../track/sources/BufferSource";

const TICK_INTERVAL_MS = 25;
const LOOKAHEAD_SECONDS = 0.1;

/**
 * Look-ahead scheduler. Wakes on a fixed timer and schedules any clip
 * boundaries falling within the next LOOKAHEAD_SECONDS window using
 * AudioContext.currentTime, rather than triggering playback in real time —
 * this is what keeps playback sample-accurate under JS timer jitter.
 */
export class Scheduler {
  private context: BaseAudioContext;
  private transport: Transport;
  private clips: Clip[] = [];
  private tracks = new Map<string, Track>();

  private timer: ReturnType<typeof setInterval> | null = null;
  private scheduledUpTo = 0;
  private lastPosition = 0;

  constructor(context: BaseAudioContext, transport: Transport) {
    this.context = context;
    this.transport = transport;
  }

  setClips(clips: Clip[]): void {
    this.clips = clips;
  }

  setTracks(tracks: Map<string, Track>): void {
    this.tracks = tracks;
  }

  start(): void {
    if (this.timer !== null) return;
    this.scheduledUpTo = this.transport.getPosition();
    this.lastPosition = this.scheduledUpTo;
    this.timer = setInterval(() => this.tick(), TICK_INTERVAL_MS);
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick(): void {
    if (!this.transport.isPlaying) return;

    const position = this.transport.getPosition();

    // A seek or loop wrap moves position backward relative to the last tick —
    // reset the schedule watermark so clips before the new position aren't skipped.
    if (position < this.lastPosition) {
      this.scheduledUpTo = position;
    }
    this.lastPosition = position;

    const windowEnd = position + LOOKAHEAD_SECONDS;

    for (const clip of this.clips) {
      if (clip.startTime < this.scheduledUpTo || clip.startTime >= windowEnd) continue;

      const track = this.tracks.get(clip.trackId);
      if (!track) continue;

      const source = new BufferSource(this.context, clip.buffer);
      source.play(track.input, {
        when: this.transport.toContextTime(clip.startTime),
        offset: clip.offset,
        duration: clip.duration,
      });
    }

    this.scheduledUpTo = windowEnd;
  }
}
