import { Sampler } from "../instruments/Sampler";
import type { Instrument, InstrumentDefinition } from "../instruments/types";
import type { Note } from "../types/note";
import { EffectsChain } from "./EffectsChain";

export interface TrackOptions {
  id: string;
  name: string;
  instrumentDef: InstrumentDefinition;
  volume?: number;
}

/**
 * Holds a track's effects chain and per-track gain/mute stages. Clip
 * playback nodes are created per-clip by the Scheduler and connected to
 * `track.input` — Track itself does not own a persistent source node.
 * Solo/mute resolution is owned by Mixer, which drives `muteGain`.
 */
export class Track {
  readonly id: string;
  name: string;

  private context: BaseAudioContext;

  readonly effectsChain: EffectsChain;
  private readonly volumeGain: GainNode;
  /** Driven by Mixer to resolve solo/mute across tracks — not set directly. */
  readonly muteGain: GainNode;

  instrument!: Instrument;

  constructor(context: BaseAudioContext, options: TrackOptions) {
    this.id = options.id;
    this.name = options.name;

    this.context = context;

    this.effectsChain = new EffectsChain(context);
    this.volumeGain = context.createGain();
    this.volumeGain.gain.value = options.volume ?? 1;
    this.muteGain = context.createGain();

    this.effectsChain.output.connect(this.volumeGain);
    this.volumeGain.connect(this.muteGain);

    this.setInstrument(options.instrumentDef);
  }

  /** Where per-clip source nodes connect in. */
  get input(): AudioNode {
    return this.effectsChain.input;
  }

  /** Final node in the track's chain — connect this to the Mixer's master bus. */
  get output(): AudioNode {
    return this.muteGain;
  }

  get volume(): AudioParam {
    return this.volumeGain.gain;
  }

  setInstrument(instrumentDef: InstrumentDefinition): void {
    if (instrumentDef.kind === "sampler") {
      this.instrument = new Sampler(this.context, instrumentDef.options);
      this.instrument.output.connect(this.input);
      this.instrument.load();
    }
  }

  playInstrument(note: Note): void {
    this.instrument?.play(note);
  }
}
