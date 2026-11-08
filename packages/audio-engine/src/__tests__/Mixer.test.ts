import { describe, expect, it } from "vitest";
import { Mixer } from "../track/Mixer";
import { Track } from "../track/Track";
import { FakeAudioContext } from "./fakeAudioContext";
import type { InstrumentDefinition } from "../instruments/types";

function createFakeContext() {
  const fake = new FakeAudioContext();
  return {
    ctx: fake as unknown as BaseAudioContext,
    destination: fake.destination as unknown as AudioNode,
  };
}

function muteGainValue(track: Track): number {
  return (track.muteGain as any).gain.value;
}

describe("Mixer", () => {
  it("leaves all tracks audible with no mutes or solos", () => {
    const { ctx, destination } = createFakeContext();
    const mixer = new Mixer(ctx, destination);
    const a = new Track(ctx, { id: "a", name: "A", instrumentDef: {} as InstrumentDefinition });
    const b = new Track(ctx, { id: "b", name: "B", instrumentDef: {} as InstrumentDefinition });
    mixer.addTrack(a);
    mixer.addTrack(b);

    expect(muteGainValue(a)).toBe(1);
    expect(muteGainValue(b)).toBe(1);
  });

  it("muting a track silences only that track", () => {
    const { ctx, destination } = createFakeContext();
    const mixer = new Mixer(ctx, destination);
    const a = new Track(ctx, { id: "a", name: "A", instrumentDef: {} as InstrumentDefinition });
    const b = new Track(ctx, { id: "b", name: "B", instrumentDef: {} as InstrumentDefinition });
    mixer.addTrack(a);
    mixer.addTrack(b);

    mixer.setMuted("a", true);

    expect(muteGainValue(a)).toBe(0);
    expect(muteGainValue(b)).toBe(1);
  });

  it("soloing a track silences every other track, muted or not", () => {
    const { ctx, destination } = createFakeContext();
    const mixer = new Mixer(ctx, destination);
    const a = new Track(ctx, { id: "a", name: "A", instrumentDef: {} as InstrumentDefinition });
    const b = new Track(ctx, { id: "b", name: "B", instrumentDef: {} as InstrumentDefinition });
    const c = new Track(ctx, { id: "c", name: "C", instrumentDef: {} as InstrumentDefinition });
    mixer.addTrack(a);
    mixer.addTrack(b);
    mixer.addTrack(c);

    mixer.setSoloed("b", true);

    expect(muteGainValue(a)).toBe(0);
    expect(muteGainValue(b)).toBe(1);
    expect(muteGainValue(c)).toBe(0);
  });

  it("un-soloing restores normal mute resolution", () => {
    const { ctx, destination } = createFakeContext();
    const mixer = new Mixer(ctx, destination);
    const a = new Track(ctx, { id: "a", name: "A", instrumentDef: {} as InstrumentDefinition });
    const b = new Track(ctx, { id: "b", name: "B", instrumentDef: {} as InstrumentDefinition });
    mixer.addTrack(a);
    mixer.addTrack(b);

    mixer.setSoloed("b", true);
    mixer.setSoloed("b", false);

    expect(muteGainValue(a)).toBe(1);
    expect(muteGainValue(b)).toBe(1);
  });
});
