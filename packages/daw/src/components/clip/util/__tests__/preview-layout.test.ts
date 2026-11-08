import { describe, expect, it } from "vitest";
import type { ClipData, SoundData } from "../../../../stores/types";
import {
  MIN_ROW_GAP,
  PREVIEW_PADDING,
  SOUND_RECT_HEIGHT,
  SOUND_RECT_MIN_WIDTH,
  layoutSounds,
} from "../preview-layout";

const HEIGHT = 72;
const PPS = 100;

function sound(id: string, midiNote: number, startTime: number, duration = 0.5): SoundData {
  return { id, clipId: "c", startTime, duration, offset: 0, midiNote } as SoundData;
}

function clip(sounds: SoundData[], startTime = 2): ClipData {
  return { id: "c", trackId: "t", startTime, duration: 5, offset: 0, sounds } as ClipData;
}

describe("layoutSounds", () => {
  it("returns nothing for an empty clip", () => {
    expect(layoutSounds(clip([]), PPS, HEIGHT)).toEqual([]);
  });

  it("centers a single row", () => {
    const [rect] = layoutSounds(clip([sound("a", 60, 2)]), PPS, HEIGHT);
    expect(rect.y).toBe((HEIGHT - SOUND_RECT_HEIGHT) / 2);
  });

  it("puts sounds on the same note in the same row", () => {
    const rects = layoutSounds(clip([sound("a", 60, 2), sound("b", 60, 3)]), PPS, HEIGHT);
    expect(rects[0].y).toBe(rects[1].y);
  });

  it("places higher notes higher and spans the full usable height", () => {
    const rects = layoutSounds(
      clip([sound("lo", 40, 2), sound("hi", 80, 2), sound("mid", 60, 2)]),
      PPS,
      HEIGHT
    );
    const y = Object.fromEntries(rects.map((r) => [r.id, r.y]));
    expect(y.hi).toBe(PREVIEW_PADDING);
    expect(y.lo).toBe(HEIGHT - PREVIEW_PADDING - SOUND_RECT_HEIGHT);
    expect(y.hi).toBeLessThan(y.mid);
    expect(y.mid).toBeLessThan(y.lo);
  });

  it("keeps only the highest notes when they do not all fit", () => {
    const maxRows = Math.floor(
      (HEIGHT - 2 * PREVIEW_PADDING + MIN_ROW_GAP) / (SOUND_RECT_HEIGHT + MIN_ROW_GAP)
    );
    const sounds = Array.from({ length: maxRows + 5 }, (_, i) => sound(`s${i}`, 20 + i, 2));
    const rects = layoutSounds(clip(sounds), PPS, HEIGHT);
    expect(rects).toHaveLength(maxRows);
    const kept = new Set(rects.map((r) => r.id));
    expect(kept.has(`s${maxRows + 4}`)).toBe(true);
    expect(kept.has("s0")).toBe(false);
  });

  it("positions x relative to the clip and scales with pixelsPerSecond", () => {
    const c = clip([sound("a", 60, 3.5)]);
    expect(layoutSounds(c, PPS, HEIGHT)[0].x).toBe(150);
    expect(layoutSounds(c, 200, HEIGHT)[0].x).toBe(300);
  });

  it("sizes width by duration with a minimum", () => {
    const rects = layoutSounds(
      clip([sound("long", 60, 2, 1), sound("tiny", 62, 2, 0.001)]),
      PPS,
      HEIGHT
    );
    expect(rects.find((r) => r.id === "long")?.width).toBe(100);
    expect(rects.find((r) => r.id === "tiny")?.width).toBe(SOUND_RECT_MIN_WIDTH);
  });

  it("skips sounds starting beyond the clip end", () => {
    const rects = layoutSounds(clip([sound("a", 60, 2), sound("b", 60, 9)]), PPS, HEIGHT);
    expect(rects.map((r) => r.id)).toEqual(["a"]);
  });
});
