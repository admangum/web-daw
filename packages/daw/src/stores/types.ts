import type { MidiNote } from "audio-engine";

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
  sounds: SoundData[];
}

export interface SoundData {
  id: string;
  clipId: string;
  startTime: number;
  duration: number;
  offset: number;
  midiNote: MidiNote;
}
