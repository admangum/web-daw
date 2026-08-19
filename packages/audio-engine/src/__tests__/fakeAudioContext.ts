/**
 * AudioContext does not exist in Node/Vitest. These are minimal
 * hand-rolled stand-ins — just enough surface area for the graph-wiring
 * and time-math logic under test, not a spec-compliant WebAudio mock.
 */

class FakeAudioParam {
  value = 0;
  setValueAtTime(value: number): this {
    this.value = value;
    return this;
  }
  linearRampToValueAtTime(value: number): this {
    this.value = value;
    return this;
  }
  setTargetAtTime(value: number): this {
    this.value = value;
    return this;
  }
  cancelScheduledValues(): this {
    return this;
  }
}

class FakeAudioNode {
  connections: FakeAudioNode[] = [];
  connect(destination: FakeAudioNode): FakeAudioNode {
    this.connections.push(destination);
    return destination;
  }
  disconnect(): void {
    this.connections = [];
  }
}

class FakeGainNode extends FakeAudioNode {
  gain = new FakeAudioParam();
  constructor() {
    super();
    this.gain.value = 1;
  }
}

class FakeBufferSourceNode extends FakeAudioNode {
  buffer: unknown = null;
  started = false;
  startedAt = 0;
  start(when = 0): void {
    this.started = true;
    this.startedAt = when;
  }
}

class FakeOscillatorNode extends FakeAudioNode {
  type = "sine";
  frequency = new FakeAudioParam();
  started = false;
  start(): void {
    this.started = true;
  }
  stop(): void {}
}

class FakeStereoPannerNode extends FakeAudioNode {
  pan = new FakeAudioParam();
}

class FakeBiquadFilterNode extends FakeAudioNode {
  type = "lowpass";
  frequency = new FakeAudioParam();
}

export class FakeAudioContext {
  currentTime = 0;
  state: "running" | "suspended" = "suspended";
  destination = new FakeAudioNode();

  createGain() {
    return new FakeGainNode() as unknown as GainNode;
  }
  createBufferSource() {
    return new FakeBufferSourceNode() as unknown as AudioBufferSourceNode;
  }
  createOscillator() {
    return new FakeOscillatorNode() as unknown as OscillatorNode;
  }
  createStereoPanner() {
    return new FakeStereoPannerNode() as unknown as StereoPannerNode;
  }
  createBiquadFilter() {
    return new FakeBiquadFilterNode() as unknown as BiquadFilterNode;
  }
  async resume(): Promise<void> {
    this.state = "running";
  }
}

export function createFakeContext(): BaseAudioContext {
  return new FakeAudioContext() as unknown as BaseAudioContext;
}
