import { create } from "zustand";

export interface LoopRegion {
  start: number;
  end: number;
}

interface TransportState {
  isPlaying: boolean;
  bpm: number;
  /** Snapshot only, written on pause/seek/stop — never on every tick. The
   *  live playhead reads AudioContext.currentTime directly instead, so
   *  playback doesn't push a store update dozens of times a second. */
  playbackPosition: number;
  loop: LoopRegion | null;
  setIsPlaying: (playing: boolean) => void;
  setBpm: (bpm: number) => void;
  setPlaybackPosition: (position: number) => void;
  setLoop: (loop: LoopRegion | null) => void;
}

export const useTransportStore = create<TransportState>((set) => ({
  isPlaying: false,
  bpm: 120,
  playbackPosition: 0,
  loop: null,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setBpm: (bpm) => set({ bpm }),
  setPlaybackPosition: (playbackPosition) => set({ playbackPosition }),
  setLoop: (loop) => set({ loop }),
}));
