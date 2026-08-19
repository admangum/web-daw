import { AudioSource, type PlayOptions } from "./AudioSource";

export interface OscillatorSourceOptions {
  type?: OscillatorType;
  frequency?: number;
}

export class OscillatorSource extends AudioSource {
  type: OscillatorType;
  frequency: number;

  constructor(context: BaseAudioContext, options: OscillatorSourceOptions = {}) {
    super(context);
    this.type = options.type ?? "sine";
    this.frequency = options.frequency ?? 440;
  }

  play(destination: AudioNode, options: PlayOptions): OscillatorNode {
    const node = this.context.createOscillator();
    node.type = this.type;
    node.frequency.value = this.frequency;
    node.connect(destination);

    node.start(options.when);
    if (options.duration !== undefined) {
      node.stop(options.when + options.duration);
    }

    return node;
  }
}
