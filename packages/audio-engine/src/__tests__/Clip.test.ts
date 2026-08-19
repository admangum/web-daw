import { describe, expect, it } from "vitest";
import { Clip } from "../timeline/Clip";

function makeClip(startTime: number, duration: number, id = "c") {
  return new Clip({
    id,
    trackId: "t1",
    startTime,
    duration,
    buffer: {} as AudioBuffer,
  });
}

describe("Clip", () => {
  it("computes endTime from startTime + duration", () => {
    const clip = makeClip(2, 3);
    expect(clip.endTime).toBe(5);
  });

  it("detects overlapping clips", () => {
    const a = makeClip(0, 5, "a");
    const b = makeClip(3, 5, "b");
    expect(a.overlaps(b)).toBe(true);
    expect(b.overlaps(a)).toBe(true);
  });

  it("does not flag adjacent, non-overlapping clips", () => {
    const a = makeClip(0, 5, "a");
    const b = makeClip(5, 5, "b");
    expect(a.overlaps(b)).toBe(false);
  });

  it("does not flag clips separated by a gap", () => {
    const a = makeClip(0, 2, "a");
    const b = makeClip(10, 2, "b");
    expect(a.overlaps(b)).toBe(false);
  });
});
