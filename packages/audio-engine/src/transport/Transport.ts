export type TransportState = "stopped" | "playing" | "paused";

export interface LoopRegion {
  start: number;
  end: number;
}

/**
 * Owns the playback clock. Position is always derived from
 * AudioContext.currentTime, never accumulated in JS, so it stays
 * sample-accurate regardless of JS timer jitter or tab throttling.
 */
export class Transport {
  private context: BaseAudioContext;
  private state: TransportState = "stopped";
  private startedAtContextTime = 0;
  private startedAtPosition = 0;
  private pausedPosition = 0;

  bpm = 120;
  loop: LoopRegion | null = null;

  constructor(context: BaseAudioContext) {
    this.context = context;
  }

  get isPlaying(): boolean {
    return this.state === "playing";
  }

  play(): void {
    if (this.state === "playing") return;
    this.startedAtContextTime = this.context.currentTime;
    this.startedAtPosition = this.pausedPosition;
    this.state = "playing";
  }

  pause(): void {
    if (this.state !== "playing") return;
    this.pausedPosition = this.getPosition();
    this.state = "paused";
  }

  stop(): void {
    this.state = "stopped";
    this.pausedPosition = 0;
  }

  seek(positionSeconds: number): void {
    const wasPlaying = this.state === "playing";
    this.pausedPosition = Math.max(0, positionSeconds);
    if (wasPlaying) {
      this.startedAtContextTime = this.context.currentTime;
      this.startedAtPosition = this.pausedPosition;
    }
  }

  /** Current playback position in seconds, derived from AudioContext.currentTime. */
  getPosition(): number {
    if (this.state !== "playing") return this.pausedPosition;

    let position = this.startedAtPosition + (this.context.currentTime - this.startedAtContextTime);

    if (this.loop && position >= this.loop.end) {
      const loopLength = this.loop.end - this.loop.start;
      const overshoot = (position - this.loop.start) % loopLength;
      position = this.loop.start + overshoot;
    }

    return position;
  }

  /** Converts a transport-relative time to an absolute AudioContext.currentTime. */
  toContextTime(positionSeconds: number): number {
    return this.startedAtContextTime + (positionSeconds - this.startedAtPosition);
  }
}
