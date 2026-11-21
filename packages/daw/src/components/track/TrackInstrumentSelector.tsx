import { Select } from "@/ui";
import { setTrackInstrument } from "../../engine/sync";
import { items } from "../../instruments/catalog";
import type { TrackData } from "../../stores/types";

interface Props {
  track: TrackData;
}

export function TrackInstrumentSelector({ track }: Props) {
  const onValueChange = (value: string) => {
    setTrackInstrument(track.id, value);
  };
  return (
    <Select
      placeholder="Select an instrument..."
      items={items}
      value={track.instrumentId}
      onValueChange={onValueChange}
    />
  );
}
