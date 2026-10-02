// import { Dialog } from "@/ui";
import { useUIStore } from "../../stores/useUIStore";
import React from "react";
import { useProjectStore } from "../../stores/useProjectStore";

export function TrackSettings() {
  const { openTrackId, openTrackSettings } = useUIStore();
  const track = useProjectStore((s) => s.tracks.find((t) => t.id === openTrackId));

  const onOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      openTrackSettings(null);
    }
  }, []);

  const isOpen = !!openTrackId;
  return null;
  // return (
  // <Dialog title="Track settings" open={isOpen} onOpenChange={onOpenChange}>
  //   {track ? (
  //     <div className="flex h-56 shrink-0 items-start gap-2 border-t border-neutral-800 p-3">
  //       Track settings (WIP)
  //     </div>
  //   ) : (
  //     <div>Something went wrong</div>
  //   )}
  // </Dialog>
  // );
}
