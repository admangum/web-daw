import { useRef } from "react";
import { getTransportPosition, seek } from "../../engine/sync";
import type { ClipData } from "../../stores/types";
import { useTransportStore } from "../../stores/useTransportStore";
import { useUIStore } from "../../stores/useUIStore";

/**
 * Open/close choreography for a clip's editor: selecting the clip's track,
 * moving the transport to the clip while it is open, and restoring the
 * previous position on close (unless playback is running).
 */
export function useClipEditor(clip: ClipData) {
  const isEditing = useUIStore((s) => s.editingClipId === clip.id);
  const transportTimeAtOpen = useRef(0);

  const open = () => {
    const ui = useUIStore.getState();
    if (ui.selectedTrackId !== clip.trackId) {
      ui.setSelectedTrackId(clip.trackId);
    }
    ui.setEditingClipId(clip.id);
    transportTimeAtOpen.current = getTransportPosition();
    seek(clip.startTime);
  };

  const close = () => {
    useUIStore.getState().setEditingClipId(null);
    if (!useTransportStore.getState().isPlaying) {
      seek(transportTimeAtOpen.current);
    }
  };

  return { isEditing, open, close };
}
