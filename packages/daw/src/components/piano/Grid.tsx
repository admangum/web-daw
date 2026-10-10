import { useProjectStore } from "../../stores/useProjectStore";
import { useUIStore } from "../../stores/useUIStore";
import { KEY_HEIGHT, NOTES_TOP_DOWN } from "./constants";

export function Grid() {
  const { bpm } = useProjectStore();
  const { pixelsPerSecond } = useUIStore();
  const bps = (bpm / 60) * 1;
  const pixelsPerBeat = Math.round(pixelsPerSecond / bps);
  console.log("pixelsPerBeat: ", pixelsPerBeat);

  return (
    <div>
      {NOTES_TOP_DOWN.map((note) => (
        <div
          className="flex items-center box-border border-b border-slate-700 w-full"
          style={{
            height: `${KEY_HEIGHT}px`,
            backgroundImage: `repeating-linear-gradient(90deg, var(--color-slate-700) 0px, transparent 1px, transparent ${pixelsPerBeat}px)`,
          }}
        >
          <span className="text-[10px] leading-none"></span>
        </div>
      ))}
    </div>
  );
}
