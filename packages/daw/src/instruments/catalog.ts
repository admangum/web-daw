export type InstrumentKind = "sample" | "oscillator";

export interface InstrumentDefinition {
  id: string;
  name: string;
  kind: InstrumentKind;
}

export const INSTRUMENTS: InstrumentDefinition[] = [{ id: "drum-machine", name: "Drum Machine", kind: "sample" }];

export const DEFAULT_INSTRUMENT_ID = INSTRUMENTS[0].id;
