import { useState } from "react";
// import { engine } from "../../engine/engine";
import { addTrack, pause, play, stop } from "../../engine/sync";
import { useTransportStore } from "../../stores/useTransportStore";
// import { ButtonComboPlayRecord } from "@/ui";
import { useProjectStore } from "../../stores/useProjectStore";

export function TransportBar() {
  const isPlaying = useTransportStore((s) => s.isPlaying);
  const { bpm } = useProjectStore();
  const [nextTrackNumber, setNextTrackNumber] = useState(1);
  return (
    <div className="flex h-22 shrink-0 items-center border-b border-slate-800 px-4">
      <div className="flex flex-col">
        <h1 className="flex-1/3 text-slate-300 text-2xl font-light">Untitled</h1>
        <div className="flex-1/3 text-slate-300 text-sm font-light">{bpm} bpm</div>
      </div>
      <div className="flex flex-1/3 justify-center">
        {/* <ButtonComboPlayRecord
          isPlaying={isPlaying}
          onPlayClick={() => play()}
          onStopClick={() => stop()}
        /> */}
      </div>
      <div className="flex flex-1/3 justify-end">
        <button
          type="button"
          onClick={() => {
            return isPlaying ? pause() : play();
          }}
          className="rounded bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => stop()}
          className="rounded bg-slate-800 px-4 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-700"
        >
          Stop
        </button>

        <div className="mx-1 h-6 w-px bg-slate-800" />

        <button
          type="button"
          onClick={() => {
            addTrack(`Track ${nextTrackNumber}`);
            setNextTrackNumber((n) => n + 1);
          }}
          className="rounded bg-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
        >
          + Add Track
        </button>
      </div>

      {/* <div className="ml-auto text-xs text-slate-500">
        {engine.state === "suspended" ? "Audio suspended — press Play to start" : null}
      </div> */}
    </div>
  );
}
