import { Select } from "@/ui";
import { setTrackInstrument } from "../../engine/sync";
import { items } from "../../instruments/catalog";
import type { TrackData } from "../../stores/types";
import React from "react";

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
      items={items}
      value={track.instrumentId}
      onValueChange={onValueChange}
    />
  );
}
