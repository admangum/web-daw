export interface PlayOptions {
  /** Absolute AudioContext.currentTime at which playback should begin. */
  when: number;
  /** Offset into the source's own material, in seconds. */
  offset?: number;
  /** How long to play, in seconds. Omit to play to the natural end. */
  duration?: number;
}

/**
 * WebAudio's own source nodes (AudioBufferSourceNode, OscillatorNode) are
 * single-use — start() can only be called once per node. AudioSource is a
 * reusable factory: each play() call creates a fresh underlying node.
 */
export abstract class AudioSource {
  protected context: BaseAudioContext;

  constructor(context: BaseAudioContext) {
    this.context = context;
  }

  abstract play(destination: AudioNode, options: PlayOptions): AudioScheduledSourceNode;
}
