/**
 * Wraps a single WebAudio node (or subgraph) with one input and one output,
 * so EffectsChain can splice it into a track's signal path uniformly.
 */
export abstract class AudioEffect {
  abstract readonly input: AudioNode;
  abstract readonly output: AudioNode;

  connect(destination: AudioNode): void {
    this.output.connect(destination);
  }

  disconnect(): void {
    this.output.disconnect();
  }
}
