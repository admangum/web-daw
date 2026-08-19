import { AudioSource, type PlayOptions } from "./AudioSource";

export class BufferSource extends AudioSource {
  buffer: AudioBuffer;

  constructor(context: BaseAudioContext, buffer: AudioBuffer) {
    super(context);
    this.buffer = buffer;
  }

  play(destination: AudioNode, options: PlayOptions): AudioBufferSourceNode {
    const node = this.context.createBufferSource();
    node.buffer = this.buffer;
    node.connect(destination);

    const offset = options.offset ?? 0;
    if (options.duration !== undefined) {
      node.start(options.when, offset, options.duration);
    } else {
      node.start(options.when, offset);
    }

    return node;
  }
}
