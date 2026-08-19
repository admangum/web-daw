import { setTrackMuted, setTrackSoloed, setTrackVolume } from "../engine/sync";
import type { TrackData } from "../stores/types";

export function TrackHeader({ track }: { track: TrackData }) {
  return (
    <div className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-800 px-3">
      <span className="flex-1 truncate text-sm text-neutral-200">{track.name}</span>
      <button
        type="button"
        onClick={() => setTrackMuted(track.id, !track.muted)}
        className={`rounded px-2 py-1 text-xs font-medium ${
          track.muted ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400"
        }`}
      >
        M
      </button>
      <button
        type="button"
        onClick={() => setTrackSoloed(track.id, !track.soloed)}
        className={`rounded px-2 py-1 text-xs font-medium ${
          track.soloed ? "bg-yellow-500 text-black" : "bg-neutral-800 text-neutral-400"
        }`}
      >
        S
      </button>
      <input
        type="range"
        min={0}
        max={1.5}
        step={0.01}
        value={track.volume}
        onChange={(e) => setTrackVolume(track.id, Number(e.target.value))}
        className="w-16"
      />
    </div>
  );
}
