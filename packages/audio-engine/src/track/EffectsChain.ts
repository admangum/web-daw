import type { AudioEffect } from "./effects/AudioEffect";

const REWIRE_RAMP_SECONDS = 0.005;

/**
 * Ordered chain of effects spliced between a track's source and its
 * destination. Insert/remove rewires the underlying node graph; the chain's
 * own gain node is ramped to 0 immediately beforehand and back to 1
 * immediately after, so rewiring while a track is playing doesn't click.
 */
export class EffectsChain {
  private context: BaseAudioContext;
  private effects: AudioEffect[] = [];
  private readonly inputGain: GainNode;
  private readonly outputGain: GainNode;

  constructor(context: BaseAudioContext) {
    this.context = context;
    this.inputGain = context.createGain();
    this.outputGain = context.createGain();
    this.rewire();
  }

  get input(): AudioNode {
    return this.inputGain;
  }

  get output(): AudioNode {
    return this.outputGain;
  }

  list(): readonly AudioEffect[] {
    return this.effects;
  }

  async insert(effect: AudioEffect, index: number = this.effects.length): Promise<void> {
    await this.muteForRewire(() => {
      this.effects.splice(index, 0, effect);
      this.rewire();
    });
  }

  async remove(effect: AudioEffect): Promise<void> {
    await this.muteForRewire(() => {
      const index = this.effects.indexOf(effect);
      if (index === -1) return;
      this.effects.splice(index, 1);
      effect.disconnect();
      this.rewire();
    });
  }

  private async muteForRewire(mutate: () => void): Promise<void> {
    const now = this.context.currentTime;
    this.outputGain.gain.cancelScheduledValues(now);
    this.outputGain.gain.setValueAtTime(this.outputGain.gain.value, now);
    this.outputGain.gain.linearRampToValueAtTime(0, now + REWIRE_RAMP_SECONDS);

    await wait(REWIRE_RAMP_SECONDS * 1000);

    mutate();

    const resumeAt = this.context.currentTime;
    this.outputGain.gain.cancelScheduledValues(resumeAt);
    this.outputGain.gain.setValueAtTime(0, resumeAt);
    this.outputGain.gain.linearRampToValueAtTime(1, resumeAt + REWIRE_RAMP_SECONDS);
  }

  private rewire(): void {
    this.inputGain.disconnect();
    for (const effect of this.effects) effect.disconnect();

    let previous: AudioNode = this.inputGain;
    for (const effect of this.effects) {
      previous.connect(effect.input);
      previous = effect.output;
    }
    previous.connect(this.outputGain);
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
