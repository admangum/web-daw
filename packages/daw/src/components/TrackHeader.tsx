import React from "react";
import { setTrackMuted, setTrackSoloed } from "../engine/sync";
import type { TrackData } from "../stores/types";
import { useUIStore } from "../stores/useUIStore";
import { TrackInstrumentSelector } from "./track/TrackInstrumentSelector";

interface Props {
  track: TrackData;
}

export function TrackHeader({ track, ...props }: Props) {
  const { setEditingTrackId, selectTrack, selectedTrackId } = useUIStore();
  const onClick = React.useCallback(() => {
    if (selectedTrackId === track.id) {
      selectTrack(null);
    } else {
      selectTrack(track.id);
    }
  }, [track, selectedTrackId]);

  const onDoubleClick = React.useCallback(() => {
    setEditingTrackId(track.id);
  }, []);

  const bg = selectedTrackId === track.id ? "bg-slate-900" : "bg-transparent";

  return (
    <div
      {...props}
      className={`flex flex-col gap-2 h-18 shrink-0 border-b border-slate-800 ${bg} p-2`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex-1 truncate text-xs text-slate-400">{track.name}</div>
      <div className="flex shrink-0 items-center gap-2">
        <TrackInstrumentSelector track={track} />
        <button
          type="button"
          onClick={() => setTrackMuted(track.id, !track.muted)}
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            track.muted ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400"
          }`}
        >
          M
        </button>
        <button
          type="button"
          onClick={() => setTrackSoloed(track.id, !track.soloed)}
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            track.soloed ? "bg-yellow-500 text-black" : "bg-slate-800 text-slate-400"
          }`}
        >
          S
        </button>
        {/* <input
          type="range"
          min={0}
          max={1.5}
          step={0.01}
          value={track.volume}
          onChange={(e) => setTrackVolume(track.id, Number(e.target.value))}
          className="w-16"
        /> */}
      </div>
    </div>
  );
}
