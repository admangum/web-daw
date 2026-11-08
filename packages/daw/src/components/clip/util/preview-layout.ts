import type { ClipData } from "../../../stores/types";

export const SOUND_RECT_MIN_WIDTH = 2;
export const SOUND_RECT_HEIGHT = 4;
export const MIN_ROW_GAP = 1;
export const PREVIEW_PADDING = 4;

export interface SoundRect {
  id: string;
  x: number;
  y: number;
  width: number;
}

/**
 * Lays out a clip's sounds as constant-height rectangles. Each distinct midi note gets one row,
 * rows are spread evenly over the available height, and when not all rows fit only the highest
 * notes are kept.
 */
export function layoutSounds(
  clip: ClipData,
  pixelsPerSecond: number,
  availableHeight: number
): SoundRect[] {
  const usableHeight = availableHeight - 2 * PREVIEW_PADDING;
  const maxRows = Math.floor((usableHeight + MIN_ROW_GAP) / (SOUND_RECT_HEIGHT + MIN_ROW_GAP));
  if (maxRows <= 0) {
    return [];
  }

  const notes = [...new Set(clip.sounds.map((s) => s.midiNote))].sort((a, b) => b - a);
  const rowByNote = new Map(notes.slice(0, maxRows).map((note, i) => [note, i]));
  const rowCount = rowByNote.size;
  const clipWidth = clip.duration * pixelsPerSecond;

  const rowY = (row: number) =>
    rowCount === 1
      ? PREVIEW_PADDING + (usableHeight - SOUND_RECT_HEIGHT) / 2
      : PREVIEW_PADDING + (row * (usableHeight - SOUND_RECT_HEIGHT)) / (rowCount - 1);

  const rects: SoundRect[] = [];
  for (const sound of clip.sounds) {
    const row = rowByNote.get(sound.midiNote);
    const x = (sound.startTime - clip.startTime) * pixelsPerSecond;
    if (row === undefined || x >= clipWidth) {
      continue;
    }
    rects.push({
      id: sound.id,
      x,
      y: rowY(row),
      width: Math.max(SOUND_RECT_MIN_WIDTH, sound.duration * pixelsPerSecond),
    });
  }
  return rects;
}
