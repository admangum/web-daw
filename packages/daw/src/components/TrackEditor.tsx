import { useProjectStore } from "../stores/useProjectStore";
import { useUIStore } from "../stores/useUIStore";
import { Instrument } from "./track/Instrument";
import { InstrumentSelector } from "./track/InstrumentSelector";

export function TrackEditor() {
  const selectedTrackId = useUIStore((s) => s.selectedTrackId);
  const track = useProjectStore((s) => s.tracks.find((t) => t.id === selectedTrackId));

  if (!track) return null;

  return (
    <div className="flex h-56 shrink-0 items-start gap-2 border-t border-neutral-800 p-3">
      <InstrumentSelector trackId={track.id} instrumentId={track.instrumentId} />
      <Instrument trackId={track.id} />
    </div>
  );
}
