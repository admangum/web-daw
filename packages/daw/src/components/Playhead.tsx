import { useEffect, useRef } from "react";
import { engine } from "../engine/engine";
import { useUIStore } from "../stores/useUIStore";

/**
 * Reads AudioContext.currentTime directly via a requestAnimationFrame loop
 * scoped to just this component, instead of going through Zustand — pushing
 * position through the store on every tick would re-render every subscriber
 * many times a second.
 */
interface Props {
  /**
   * Offset of the playhead from the beginning of the track in milliseconds.
   * Useful when showing the playhead in the clip editor.
   */
  offset?: number;
}

export function Playhead({ offset = 0 }: Props) {
  const lineRef = useRef<HTMLDivElement>(null);
  const pixelsPerSecond = useUIStore((s) => s.pixelsPerSecond);

  useEffect(() => {
    let frame: number;

    const tick = () => {
      const position = Math.max(engine.transport.getPosition() - offset, 0);
      if (lineRef.current) {
        lineRef.current.style.transform = `translateX(${position * pixelsPerSecond}px)`;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pixelsPerSecond]);

  return (
    <div
      ref={lineRef}
      className="pointer-events-none absolute top-0 bottom-0 left-0 w-px bg-red-500"
    />
  );
}
