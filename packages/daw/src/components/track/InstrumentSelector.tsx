import { setTrackInstrument } from "../../engine/sync";
import { INSTRUMENTS } from "../../instruments/catalog";

export function InstrumentSelector({
  trackId,
  instrumentId,
}: {
  trackId: string;
  instrumentId: string;
}) {
  return (
    <select
      name="instrument"
      value={instrumentId}
      onChange={(e) => {
        setTrackInstrument(trackId, e.target.value);
      }}
      className="rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-200"
    >
      {INSTRUMENTS.map(([id, instrument]) => (
        <option key={id} value={id}>
          {instrument.name}
        </option>
      ))}
    </select>
  );
}
