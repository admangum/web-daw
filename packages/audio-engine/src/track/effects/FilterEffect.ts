import { AudioEffect } from "./AudioEffect";

export class FilterEffect extends AudioEffect {
  readonly input: BiquadFilterNode;
  readonly output: BiquadFilterNode;

  constructor(context: BaseAudioContext, type: BiquadFilterType = "lowpass", frequency = 20000) {
    super();
    this.input = context.createBiquadFilter();
    this.input.type = type;
    this.input.frequency.value = frequency;
    this.output = this.input;
  }
}
