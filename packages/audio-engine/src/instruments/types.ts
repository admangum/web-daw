type FileURL = string;
export type PitchNotation = string;

interface SampleURLMap {
  [note: PitchNotation]: FileURL;
}

interface SamplerDefinition {
  name?: string;
  kind: "sampler";
  options: {
    sampleURLMap: SampleURLMap;
  };
}

export type SamplerOptions = SamplerDefinition["options"];

export type InstrumentDefinition = SamplerDefinition;

export interface Instrument {
  output: AudioNode;
  play(note: PitchNotation): void;
  load(): Promise<void>;
}
