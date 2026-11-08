import type { InstrumentDefinition } from "audio-engine";
import DrumKitA from "./drum-machine/kit-a";

const INSTRUMENTS: [string, InstrumentDefinition][] = [
  [
    "drum-kit-alpha",
    {
      name: "Drum Kit Alpha",
      kind: "sampler",
      options: {
        sampleURLMap: DrumKitA,
      },
    },
  ],
  [
    "drum-kit-beta",
    {
      name: "Drum Kit Beta",
      kind: "sampler",
      options: {
        sampleURLMap: DrumKitA,
      },
    },
  ],
  [
    "synth-gamma",
    {
      name: "Synth Gamma",
      kind: "synth",
      options: {},
    },
  ],
];

type InstrumentID = (typeof INSTRUMENTS)[number][0];

export const DEFAULT_INSTRUMENT_ID: InstrumentID = INSTRUMENTS[0][0];
export const INSTRUMENT_MAP: Map<InstrumentID, InstrumentDefinition> = new Map(INSTRUMENTS);

/**
 * List of instruments for use in selectboxes
 */
export const items = INSTRUMENTS.map(([value, meta]) => ({ value, label: meta.name }));

export function getInstrumentDef(id: InstrumentID = DEFAULT_INSTRUMENT_ID) {
  return INSTRUMENT_MAP.get(id) as InstrumentDefinition;
}
