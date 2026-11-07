import { create } from "zustand";

interface UIState {
  selectedTrackId: string | null;
  editingTrackId: string | null;
  editingClipId: string | null;
  pixelsPerSecond: number;
  selectTrack: (id: string | null) => void;
  setEditingTrackId: (id: string | null) => void;
  setEditingClipId: (id: string | null) => void;
  setPixelsPerSecond: (value: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedTrackId: null,
  editingTrackId: null,
  editingClipId: null,
  pixelsPerSecond: 80,
  selectTrack: (selectedTrackId) => set({ selectedTrackId }),
  setEditingTrackId: (editingTrackId) => set({ editingTrackId }),
  setEditingClipId: (editingClipId) => set({ editingClipId }),
  setPixelsPerSecond: (pixelsPerSecond) => set({ pixelsPerSecond }),
}));
