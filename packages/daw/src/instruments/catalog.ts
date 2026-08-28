import type { InstrumentDefinition } from "audio-engine";
import DrumKitA from "./drum-machine/kit-a";

export const INSTRUMENTS: [string, InstrumentDefinition][] = [
  ["none", {} as any],
  [
    "drum-machine",
    {
      name: "Drum Machine",
      kind: "sampler",
      options: {
        sampleURLMap: DrumKitA,
      },
    },
  ],
];

export const INSTRUMENT_MAP: Map<string, InstrumentDefinition> = new Map(INSTRUMENTS);

export const DEFAULT_INSTRUMENT_ID = INSTRUMENTS[0][0];
