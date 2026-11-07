import { Timeline } from "./components/Timeline";
import { TimeRulerSpacer } from "./components/TimeRulerSpacer";
import { ChannelRack } from "./components/ChannelRack";
import { TrackHeader } from "./components/TrackHeader";
import { TransportBar } from "./components/transport/TransportBar";
import { useProjectStore } from "./stores/useProjectStore";

function App() {
  const tracks = useProjectStore((s) => s.tracks);

  return (
    <div className="flex flex-col h-screen bg-slate-1000 text-slate-100">
      <TransportBar />
      <div id="main" className="relative flex flex-1 overflow-y-scroll">
        <div className="flex w-54 shrink-0 flex-col border-r border-slate-800">
          <TimeRulerSpacer />
          {tracks.length === 0 ? (
            <div className="p-3 text-xs text-slate-500">
              No tracks yet — add one from the transport bar.
            </div>
          ) : (
            tracks.map((track) => <TrackHeader key={track.id} track={track} />)
          )}
        </div>
        <Timeline className="relative flex-1" />
      </div>

      <ChannelRack />

      {/* <TrackSettings /> */}
    </div>
  );
}

export default App;
