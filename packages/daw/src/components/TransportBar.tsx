import { useState } from "react";
import { engine } from "../engine/engine";
import { addTrack, pause, play, stop } from "../engine/sync";
import { useTransportStore } from "../stores/useTransportStore";

export function TransportBar() {
  const isPlaying = useTransportStore((s) => s.isPlaying);
  const [nextTrackNumber, setNextTrackNumber] = useState(1);

  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-neutral-800 bg-neutral-900 px-4">
      <button
        type="button"
        onClick={() => (isPlaying ? pause() : play())}
        className="rounded bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <button
        type="button"
        onClick={() => stop()}
        className="rounded bg-neutral-800 px-4 py-1.5 text-sm font-medium text-neutral-200 hover:bg-neutral-700"
      >
        Stop
      </button>

      <div className="mx-1 h-6 w-px bg-neutral-800" />

      <button
        type="button"
        onClick={() => {
          addTrack(`Track ${nextTrackNumber}`);
          setNextTrackNumber((n) => n + 1);
        }}
        className="rounded bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-700"
      >
        + Add Track
      </button>

      <div className="ml-auto text-xs text-neutral-500">
        {engine.state === "suspended" ? "Audio suspended — press Play to start" : null}
      </div>
    </div>
  );
}
