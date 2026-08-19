import type { Track } from "./Track";

/**
 * Owns cross-track solo/mute resolution and the master bus. Individual
 * Track instances don't know about each other; Mixer computes each track's
 * effective gain (muted vs not) and drives Track.muteGain accordingly.
 */
export class Mixer {
  private readonly context: BaseAudioContext;
  readonly master: GainNode;

  private tracks = new Map<string, Track>();
  private muted = new Set<string>();
  private soloed = new Set<string>();

  constructor(context: BaseAudioContext, destination: AudioNode) {
    this.context = context;
    this.master = context.createGain();
    this.master.connect(destination);
  }

  addTrack(track: Track): void {
    this.tracks.set(track.id, track);
    track.output.connect(this.master);
    this.resolve();
  }

  removeTrack(track: Track): void {
    this.tracks.delete(track.id);
    this.muted.delete(track.id);
    this.soloed.delete(track.id);
    track.output.disconnect();
    this.resolve();
  }

  setMuted(trackId: string, muted: boolean): void {
    if (muted) this.muted.add(trackId);
    else this.muted.delete(trackId);
    this.resolve();
  }

  setSoloed(trackId: string, soloed: boolean): void {
    if (soloed) this.soloed.add(trackId);
    else this.soloed.delete(trackId);
    this.resolve();
  }

  private resolve(): void {
    const now = this.context.currentTime;
    const anySoloed = this.soloed.size > 0;

    for (const [id, track] of this.tracks) {
      const audible = anySoloed ? this.soloed.has(id) : !this.muted.has(id);
      track.muteGain.gain.setTargetAtTime(audible ? 1 : 0, now, 0.005);
    }
  }
}
