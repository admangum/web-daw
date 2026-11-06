import { create } from "zustand";
import type { ClipData, TrackData } from "./types";

interface ProjectState {
  name: string;
  bpm: number;
  tracks: TrackData[];
  clips: ClipData[];
  addTrack: (track: TrackData) => void;
  removeTrack: (id: string) => void;
  updateTrack: (id: string, patch: Partial<TrackData>) => void;
  getClip: (id: string) => ClipData;
  addClip: (clip: ClipData) => void;
  removeClip: (id: string) => void;
  updateClip: (id: string, patch: Partial<ClipData>) => void;
}

/**
 * Plain serializable project data — no AudioNodes or AudioBuffers. Actions
 * here only touch this store; engine wiring lives in engine/sync.ts, which
 * is the sole translator between this state and the live audio-engine graph.
 */
export const useProjectStore = create<ProjectState>((set, get) => ({
  name: "Untitled Project",
  bpm: 120,
  tracks: [],
  clips: [],
  getClip: (id) => get().clips.find((c) => c.id === id)!,
  addTrack: (track) => set((s) => ({ tracks: [...s.tracks, track] })),

  removeTrack: (id) =>
    set((s) => ({
      tracks: s.tracks.filter((t) => t.id !== id),
      clips: s.clips.filter((c) => c.trackId !== id),
    })),

  updateTrack: (id, patch) =>
    set((s) => ({
      tracks: s.tracks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),

  addClip: (clip) => set((s) => ({ clips: [...s.clips, clip] })),

  removeClip: (id) => set((s) => ({ clips: s.clips.filter((c) => c.id !== id) })),

  updateClip: (id, patch) =>
    set((s) => ({ clips: s.clips.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
}));
