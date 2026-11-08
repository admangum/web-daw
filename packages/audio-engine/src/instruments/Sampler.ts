import { BufferSource } from "../track/sources";
import type { MidiNote, Note } from "../types/note";
import { isMidiNote, noteToMidiNote } from "../utils/note";
import type { SamplerOptions, Instrument } from "./types";

type SampleBufferMap = Map<MidiNote, AudioBuffer>;

export class Sampler implements Instrument {
  private options: SamplerOptions;
  private context: BaseAudioContext;
  private sampleBufferMap: SampleBufferMap;
  private muteGain: GainNode;

  constructor(context: BaseAudioContext, options: SamplerOptions) {
    this.options = Object.assign<Partial<SamplerOptions>, SamplerOptions>({}, options);
    this.context = context;
    this.muteGain = this.context.createGain();
    this.sampleBufferMap = new Map();
  }

  get output(): AudioNode {
    return this.muteGain;
  }

  public getAudioBuffer(note: Note) {
    return this.sampleBufferMap.get(noteToMidiNote(note));
  }

  public async load(): Promise<void> {
    const samplesLoading = Object.entries(this.options.sampleURLMap).map(([note, fileURL]) => {
      return fetch(fileURL)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => this.context.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
          this.sampleBufferMap.set(noteToMidiNote(note as Note), audioBuffer);
          return audioBuffer;
        });
    });
    return new Promise((resolve, reject) => {
      Promise.all(samplesLoading)
        .then(() => resolve())
        .catch(reject);
    });
  }

  public play(note: Note | MidiNote): void {
    const noteToPlay = isMidiNote(note) ? note : noteToMidiNote(note);
    const buffer = this.sampleBufferMap.get(noteToPlay);
    if (!buffer) return;
    const source = new BufferSource(this.context, buffer);
    source.play(this.muteGain, { when: this.context.currentTime });
  }
}
