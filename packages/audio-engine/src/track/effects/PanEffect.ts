import { AudioEffect } from "./AudioEffect";

export class PanEffect extends AudioEffect {
  readonly input: StereoPannerNode;
  readonly output: StereoPannerNode;

  constructor(context: BaseAudioContext, pan = 0) {
    super();
    this.input = context.createStereoPanner();
    this.input.pan.value = pan;
    this.output = this.input;
  }

  get pan(): AudioParam {
    return this.input.pan;
  }
}
