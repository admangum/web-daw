import { BufferSource } from "../track/sources";
import type { SamplerOptions, PitchNotation, Instrument } from "./types";

type SampleBufferMap = Map<PitchNotation, AudioBuffer>;

export class Sampler implements Instrument {
  private options: SamplerOptions;
  private context: BaseAudioContext;
  private sampleBufferMap: SampleBufferMap;
  private muteGain: GainNode;

  constructor(context: BaseAudioContext, options: SamplerOptions);
  constructor() {
    this.options = Object.assign<Partial<SamplerOptions>, SamplerOptions>({}, arguments[1]);
    this.context = arguments[0];
    this.muteGain = this.context.createGain();
    this.sampleBufferMap = new Map();
  }

  get output(): AudioNode {
    return this.muteGain;
  }

  public async load(): Promise<void> {
    const samplesLoading = Object.entries(this.options.sampleURLMap).map(([note, fileURL]) => {
      return fetch(fileURL)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => this.context.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
          this.sampleBufferMap.set(note, audioBuffer);
          return audioBuffer;
        });
    });
    return new Promise((resolve, reject) => {
      Promise.all(samplesLoading)
        .then(() => resolve())
        .catch(reject);
    });
  }

  public play(note: PitchNotation): void {
    const buffer = this.sampleBufferMap.get(note);
    if (!buffer) return;
    const source = new BufferSource(this.context, buffer);
    source.play(this.muteGain, { when: this.context.currentTime });
  }
}
