import type { MidiNote, Note } from "../types/note";

type FileURL = string;

export type SampleURLMap = Partial<{
  [note in Note]: FileURL;
}>;

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
  play(note: Note | MidiNote): void;
  load(): Promise<void>;
  getAudioBuffer(note: Note): AudioBuffer | undefined;
}
