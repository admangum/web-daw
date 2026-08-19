import { describe, expect, it } from "vitest";
import { Transport } from "../transport/Transport";
import { FakeAudioContext } from "./fakeAudioContext";

describe("Transport", () => {
  it("derives position from AudioContext.currentTime, not JS-accumulated time", () => {
    const ctx = new FakeAudioContext();
    const transport = new Transport(ctx as unknown as BaseAudioContext);

    ctx.currentTime = 10;
    transport.play();

    ctx.currentTime = 12.5;
    expect(transport.getPosition()).toBeCloseTo(2.5);
  });

  it("resumes from the paused position rather than restarting at 0", () => {
    const ctx = new FakeAudioContext();
    const transport = new Transport(ctx as unknown as BaseAudioContext);

    ctx.currentTime = 0;
    transport.play();
    ctx.currentTime = 3;
    transport.pause();
    expect(transport.getPosition()).toBeCloseTo(3);

    ctx.currentTime = 10;
    transport.play();
    ctx.currentTime = 11;
    expect(transport.getPosition()).toBeCloseTo(4);
  });

  it("seeking while playing keeps the clock consistent", () => {
    const ctx = new FakeAudioContext();
    const transport = new Transport(ctx as unknown as BaseAudioContext);

    ctx.currentTime = 0;
    transport.play();
    ctx.currentTime = 1;
    transport.seek(20);
    ctx.currentTime = 3;
    expect(transport.getPosition()).toBeCloseTo(22);
  });

  it("wraps position within the loop region", () => {
    const ctx = new FakeAudioContext();
    const transport = new Transport(ctx as unknown as BaseAudioContext);
    transport.loop = { start: 4, end: 8 };

    ctx.currentTime = 0;
    transport.play();
    ctx.currentTime = 9; // 5s past loop start of 4 -> wraps within a 4s loop
    expect(transport.getPosition()).toBeCloseTo(5);
  });

  it("stop resets position to 0", () => {
    const ctx = new FakeAudioContext();
    const transport = new Transport(ctx as unknown as BaseAudioContext);

    ctx.currentTime = 0;
    transport.play();
    ctx.currentTime = 5;
    transport.stop();
    expect(transport.getPosition()).toBe(0);
  });
});
