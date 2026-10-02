import { useProjectStore } from "../stores/useProjectStore";
import { useUIStore } from "../stores/useUIStore";
import { Instrument } from "./track/Instrument";
import { TrackInstrumentSelector } from "./track/TrackInstrumentSelector";

export function TrackEditor() {
  const selectedTrackId = useUIStore((s) => s.selectedTrackId);
  const track = useProjectStore((s) => s.tracks.find((t) => t.id === selectedTrackId));

  if (!track) return null;

  return (
    <div className="flex h-56 shrink-0 items-start gap-2 border-t border-neutral-800 p-3">
      <TrackInstrumentSelector track={track} />
      <Instrument trackId={track.id} />
    </div>
  );
}
