import { describe, expect, it } from "vitest";
import { EffectsChain } from "../track/EffectsChain";
import { GainEffect } from "../track/effects";
import { createFakeContext } from "./fakeAudioContext";

function connectionsOf(node: any): any[] {
  return node.connections;
}

describe("EffectsChain", () => {
  it("starts with input wired straight through to output", () => {
    const ctx = createFakeContext();
    const chain = new EffectsChain(ctx);
    expect(connectionsOf(chain.input)).toEqual([chain.output]);
  });

  it("splices an inserted effect between input and output, in order", async () => {
    const ctx = createFakeContext();
    const chain = new EffectsChain(ctx);
    const a = new GainEffect(ctx);
    const b = new GainEffect(ctx);

    await chain.insert(a);
    await chain.insert(b);

    expect(chain.list()).toEqual([a, b]);
    expect(connectionsOf(chain.input)).toEqual([a.input]);
    expect(connectionsOf(a.output)).toEqual([b.input]);
    expect(connectionsOf(b.output)).toEqual([chain.output]);
  });

  it("rewires around a removed effect", async () => {
    const ctx = createFakeContext();
    const chain = new EffectsChain(ctx);
    const a = new GainEffect(ctx);
    const b = new GainEffect(ctx);
    await chain.insert(a);
    await chain.insert(b);

    await chain.remove(a);

    expect(chain.list()).toEqual([b]);
    expect(connectionsOf(chain.input)).toEqual([b.input]);
    expect(connectionsOf(b.output)).toEqual([chain.output]);
  });

  it("restores output gain to 1 after a rewire completes", async () => {
    const ctx = createFakeContext();
    const chain = new EffectsChain(ctx);
    await chain.insert(new GainEffect(ctx));

    expect((chain.output as any).gain.value).toBe(1);
  });
});
