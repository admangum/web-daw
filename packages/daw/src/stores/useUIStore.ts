import { create } from "zustand";

interface UIState {
  selectedTrackId: string | null;
  openTrackId: string | null;
  pixelsPerSecond: number;
  selectTrack: (id: string | null) => void;
  openTrackSettings: (id: string | null) => void;
  setPixelsPerSecond: (value: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedTrackId: null,
  openTrackId: null,
  pixelsPerSecond: 80,
  selectTrack: (selectedTrackId) => set({ selectedTrackId }),
  openTrackSettings: (openTrackId) => set({ openTrackId }),
  setPixelsPerSecond: (pixelsPerSecond) => set({ pixelsPerSecond }),
}));
