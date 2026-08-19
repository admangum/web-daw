import { AudioEffect } from "./AudioEffect";

export class GainEffect extends AudioEffect {
  readonly input: GainNode;
  readonly output: GainNode;

  constructor(context: BaseAudioContext, gain = 1) {
    super();
    this.input = context.createGain();
    this.input.gain.value = gain;
    this.output = this.input;
  }

  get gain(): AudioParam {
    return this.input.gain;
  }
}
