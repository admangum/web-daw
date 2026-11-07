import { Select } from "@/ui";
import { setTrackInstrument } from "../../engine/sync";
import { INSTRUMENTS } from "../../instruments/catalog";
import type { TrackData } from "../../stores/types";
import React from "react";

const instruments = INSTRUMENTS.map(([value, meta]) => ({ value, label: meta.name }));

interface Props {
  track: TrackData;
}

export function TrackInstrumentSelector({ track }: Props) {
  const onValueChange = React.useCallback(
    (value: string) => {
      setTrackInstrument(track.id, value);
    },
    [track]
  );
  return (
    <Select
      placeholder="Select an instrument..."
      items={instruments}
      value={track.instrumentId}
      onValueChange={onValueChange}
    />
  );
}
