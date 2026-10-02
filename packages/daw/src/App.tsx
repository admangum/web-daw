import { ModalManager } from "./components/ModalManager";
import { Timeline } from "./components/Timeline";
import { TimeRulerSpacer } from "./components/TimeRulerSpacer";
import { TrackSettings } from "./components/track/TrackSettings";
import { TrackEditor } from "./components/TrackEditor";
import { TrackHeader } from "./components/TrackHeader";
import { TransportBar } from "./components/TransportBar";
import { useProjectStore } from "./stores/useProjectStore";

function App() {
  const tracks = useProjectStore((s) => s.tracks);

  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-neutral-100">
      <TransportBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-54 shrink-0 flex-col border-r border-neutral-800">
          <TimeRulerSpacer />
          {tracks.length === 0 ? (
            <div className="p-3 text-xs text-neutral-500">
              No tracks yet — add one from the transport bar.
            </div>
          ) : (
            tracks.map((track) => <TrackHeader key={track.id} track={track} />)
          )}
        </div>
        <Timeline />
      </div>
      {/* <TrackEditor /> */}
      <TrackSettings />
      {/* <ModalManager /> */}
    </div>
  );
}

export default App;
