import { useRef, type MouseEvent } from "react";
import type { ClipData, SoundData } from "../../stores/types";
import { useProjectStore } from "../../stores/useProjectStore";
import { useUIStore } from "../../stores/useUIStore";
import * as Sync from "../../engine/sync";
import { Sound } from "../sound/Sound";
import { KEY_HEIGHT, NOTES_TOP_DOWN } from "./constants";
import { Playhead } from "../Playhead";

interface Props {
  clip: ClipData;
}

export function Grid({ clip }: Props) {
  const { bpm } = useProjectStore();
  const { pixelsPerSecond } = useUIStore();
  const bps = (bpm / 60) * 1;
  const pixelsPerBeat = Math.round(pixelsPerSecond / bps);
  const gridElRef = useRef<HTMLDivElement | null>(null);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget !== gridElRef.current) {
      return;
    }
    e.stopPropagation();
    const midiNote = parseInt((e.target as HTMLDivElement).dataset.midiNote || "0", 10);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelsPerBeat) * pixelsPerBeat;
    const startTime = clip.startTime + x / pixelsPerSecond;
    Sync.addSoundAt(clip, midiNote, startTime);
  };

  return (
    <div id="clip-editor-grid" className="relative" ref={gridElRef} onClick={onClick}>
      <>
        {NOTES_TOP_DOWN.map((midiNote) => (
          <div
            data-midi-note={midiNote}
            className="relative flex items-center box-border border-b border-slate-700 w-full"
            style={{
              height: `${KEY_HEIGHT}px`,
              backgroundImage: `repeating-linear-gradient(90deg, var(--color-slate-700) 0px, transparent 1px, transparent ${pixelsPerBeat}px)`,
            }}
          >
            {clip.sounds.map((sound) => {
              if (sound.midiNote === midiNote) {
                return (
                  <Sound
                    sound={sound}
                    pos={{
                      x: (sound.startTime - clip.startTime) * pixelsPerSecond,
                      y: 0,
                    }}
                    size={{
                      width: pixelsPerBeat,
                    }}
                    onClick={() => {}}
                  />
                );
              }
            })}
          </div>
        ))}
      </>
      <Playhead offset={clip.startTime} />
    </div>
  );
}
