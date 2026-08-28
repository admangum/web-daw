import { playTrackInstrument } from "../../engine/sync";

function Pad(props: any) {
  const { children, ...rest } = props;
  return (
    <div className="w-20 h-20 rounded bg-neutral-800 p-1.5 text-xs" {...rest}>
      {children}
    </div>
  );
}

interface Props {
  trackId: string;
}

export function Instrument({ trackId }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Pad onMouseDown={() => playTrackInstrument(trackId, "C3")}>kick</Pad>
      <Pad onMouseDown={() => playTrackInstrument(trackId, "C4")}>snare</Pad>
      <Pad onMouseDown={() => playTrackInstrument(trackId, "C5")}>hihat</Pad>
      <Pad onMouseDown={() => playTrackInstrument(trackId, "C6")}>clap</Pad>
    </div>
  );
}
