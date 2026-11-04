import type { Note } from "../types/note";

type FileURL = string;
export type PitchNotation = string;

interface SampleURLMap {
  [note: PitchNotation]: FileURL;
}

interface SamplerDefinition {
  name: string;
  kind: "sampler";
  options: {
    sampleURLMap: SampleURLMap;
  };
}

interface SynthDefinition {
  name: string;
  kind: "synth";
  options: {};
}

export type SamplerOptions = SamplerDefinition["options"];

export type InstrumentDefinition = SamplerDefinition | SynthDefinition;

export interface Instrument {
  output: AudioNode;
  play(note: PitchNotation): void;
  load(): Promise<void>;
  getAudioBuffer(note: Note): AudioBuffer | undefined;
}
