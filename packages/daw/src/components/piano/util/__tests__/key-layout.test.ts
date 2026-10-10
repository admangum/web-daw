import { describe, expect, it } from "vitest";
import {
  KEY_HEIGHT,
  NOTES_TOP_DOWN,
  isBlackKey,
  isC,
  noteName,
  noteTop,
  octave,
  scrollTopForNote,
} from "../key-layout";

describe("key layout", () => {
  it("names notes with middle C as C4", () => {
    expect(noteName(60)).toBe("C4");
    expect(noteName(0)).toBe("C-1");
    expect(noteName(127)).toBe("G9");
    expect(noteName(61)).toBe("C#4");
  });

  it("computes octaves", () => {
    expect(octave(0)).toBe(-1);
    expect(octave(11)).toBe(-1);
    expect(octave(12)).toBe(0);
    expect(octave(60)).toBe(4);
  });

  it("identifies black keys and Cs", () => {
    const blacks = [...Array(12).keys()].filter(isBlackKey);
    expect(blacks).toEqual([1, 3, 6, 8, 10]);
    expect(isC(60)).toBe(true);
    expect(isC(61)).toBe(false);
  });

  it("lists all 128 notes from highest to lowest", () => {
    expect(NOTES_TOP_DOWN).toHaveLength(128);
    expect(NOTES_TOP_DOWN[0]).toBe(127);
    expect(NOTES_TOP_DOWN[127]).toBe(0);
  });

  it("places higher notes nearer the top", () => {
    expect(noteTop(127)).toBe(0);
    expect(noteTop(126)).toBe(KEY_HEIGHT);
    expect(noteTop(0)).toBe(127 * KEY_HEIGHT);
  });

  it("centers a note in the viewport and clamps at the ends", () => {
    const viewport = 200;
    expect(scrollTopForNote(60, viewport)).toBe(noteTop(60) + KEY_HEIGHT / 2 - viewport / 2);
    expect(scrollTopForNote(127, viewport)).toBe(0);
    expect(scrollTopForNote(0, viewport)).toBe(128 * KEY_HEIGHT - viewport);
    expect(scrollTopForNote(500, viewport)).toBe(0);
  });
});
