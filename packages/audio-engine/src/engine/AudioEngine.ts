import { Transport } from "../transport/Transport";
import { Track, type TrackOptions } from "../track/Track";
import { Mixer } from "../track/Mixer";
import { Scheduler } from "../timeline/Scheduler";
import { Clip } from "../timeline/Clip";

export interface EngineOptions {
  context?: AudioContext;
}

/**
 * Entry point for audio-engine. Owns the AudioContext, transport, mixer,
 * tracks, and scheduler. Browsers block AudioContext until a user gesture —
 * call resume() from the first user-initiated action (e.g. pressing play),
 * and check `state` to reflect suspended/running in the UI.
 */
export class AudioEngine {
  readonly context: AudioContext;
  readonly transport: Transport;
  readonly mixer: Mixer;
  readonly scheduler: Scheduler;

  private tracks = new Map<string, Track>();
  private clips: Clip[] = [];

  constructor(options: EngineOptions = {}) {
    this.context = options.context ?? new AudioContext();
    this.transport = new Transport(this.context);
    this.mixer = new Mixer(this.context, this.context.destination);
    this.scheduler = new Scheduler(this.context, this.transport);
  }

  get state(): AudioContextState {
    return this.context.state;
  }

  /** Must be called from a user gesture before playback can produce sound. */
  async resume(): Promise<void> {
    if (this.context.state === "suspended") {
      await this.context.resume();
    }
  }

  addTrack(options: TrackOptions): Track {
    const track = new Track(this.context, options);
    this.tracks.set(track.id, track);
    this.mixer.addTrack(track);
    this.scheduler.setTracks(this.tracks);
    return track;
  }

  removeTrack(trackId: string): void {
    const track = this.tracks.get(trackId);
    if (!track) return;
    this.mixer.removeTrack(track);
    this.tracks.delete(trackId);
    this.scheduler.setTracks(this.tracks);
  }

  getTrack(trackId: string): Track | undefined {
    return this.tracks.get(trackId);
  }

  setClips(clips: Clip[]): void {
    this.clips = clips;
    this.scheduler.setClips(this.clips);
  }

  async play(): Promise<void> {
    await this.resume();
    this.transport.play();
    this.scheduler.start();
  }

  pause(): void {
    this.transport.pause();
    this.scheduler.stop();
  }

  stop(): void {
    this.transport.stop();
    this.scheduler.stop();
  }
}
