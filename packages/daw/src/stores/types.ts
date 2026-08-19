export interface TrackData {
  id: string;
  name: string;
  volume: number;
  muted: boolean;
  soloed: boolean;
  instrumentId: string;
}

export interface ClipData {
  id: string;
  trackId: string;
  startTime: number;
  duration: number;
  offset: number;
  /** Key into the engine-side AudioBuffer cache — the store itself stays JSON-serializable. */
  bufferId: string;
}
