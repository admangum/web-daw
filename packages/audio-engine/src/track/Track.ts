import { EffectsChain } from "./EffectsChain";

export interface TrackOptions {
  id: string;
  name: string;
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

  readonly effectsChain: EffectsChain;
  private readonly volumeGain: GainNode;
  /** Driven by Mixer to resolve solo/mute across tracks — not set directly. */
  readonly muteGain: GainNode;

  constructor(context: BaseAudioContext, options: TrackOptions) {
    this.id = options.id;
    this.name = options.name;

    this.effectsChain = new EffectsChain(context);
    this.volumeGain = context.createGain();
    this.volumeGain.gain.value = options.volume ?? 1;
    this.muteGain = context.createGain();

    this.effectsChain.output.connect(this.volumeGain);
    this.volumeGain.connect(this.muteGain);
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
}
