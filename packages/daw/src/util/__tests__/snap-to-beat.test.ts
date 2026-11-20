import { describe, expect, it } from "vitest";
import { snapToBeat } from "../snap-to-beat";

// 40px per beat at 80px per second makes a beat half a second long.
const base = { rectLeft: 10, pixelsPerBeat: 40, pixelsPerSecond: 80 };

describe("snapToBeat", () => {
  it("returns 0 for a click inside the first beat", () => {
    expect(snapToBeat({ ...base, clientX: 25 })).toBe(0);
  });

  it("returns 0 for a click exactly on the left edge", () => {
    expect(snapToBeat({ ...base, clientX: 10 })).toBe(0);
  });

  it("snaps a click exactly on a beat boundary to that beat", () => {
    expect(snapToBeat({ ...base, clientX: 50 })).toBe(0.5);
  });

  it("floors a mid-beat click to the start of its beat", () => {
    expect(snapToBeat({ ...base, clientX: 100 })).toBe(1);
  });

  it("floors a click just before the next boundary to the previous beat", () => {
    expect(snapToBeat({ ...base, clientX: 49 })).toBe(0);
  });

  it("measures from rectLeft, not from 0", () => {
    expect(snapToBeat({ ...base, rectLeft: 200, clientX: 290 })).toBe(1);
  });

  it("scales with pixelsPerSecond", () => {
    expect(snapToBeat({ ...base, pixelsPerBeat: 40, pixelsPerSecond: 40, clientX: 100 })).toBe(2);
  });

  it("returns a negative offset for a click left of the element", () => {
    expect(snapToBeat({ ...base, clientX: 0 })).toBe(-0.5);
  });
});
