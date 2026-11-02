import { useProjectStore } from "../stores/useProjectStore";
import { useUIStore } from "../stores/useUIStore";
// import { Instrument } from "./track/Instrument";
// import { TrackInstrumentSelector } from "./track/TrackInstrumentSelector";

interface Props {
  className?: string;
}

export function ChannelRack({}: Props) {
  const selectedTrackId = useUIStore((s) => s.selectedTrackId);
  const track = useProjectStore((s) => s.tracks.find((t) => t.id === selectedTrackId));

  if (!track) return null;

  return (
    <div
      className={`transition-all ease-out h-52 opacity-100 duration-250 starting:h-0 starting:opacity-0`}
    >
      <div className="flex h-full shrink-0 items-start gap-2 border-t border-slate-700 p-3">
        {/* <TrackInstrumentSelector track={track} /> */}
        {/* <Instrument trackId={track.id} /> */}
      </div>
    </div>
  );
}
