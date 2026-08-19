import { create } from "zustand";

interface UIState {
  selectedTrackId: string | null;
  pixelsPerSecond: number;
  selectTrack: (id: string | null) => void;
  setPixelsPerSecond: (value: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedTrackId: null,
  pixelsPerSecond: 80,
  selectTrack: (selectedTrackId) => set({ selectedTrackId }),
  setPixelsPerSecond: (pixelsPerSecond) => set({ pixelsPerSecond }),
}));
