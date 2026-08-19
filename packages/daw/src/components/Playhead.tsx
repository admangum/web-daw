import { useEffect, useRef } from "react";
import { engine } from "../engine/engine";
import { useUIStore } from "../stores/useUIStore";

/**
 * Reads AudioContext.currentTime directly via a requestAnimationFrame loop
 * scoped to just this component, instead of going through Zustand — pushing
 * position through the store on every tick would re-render every subscriber
 * many times a second.
 */
export function Playhead() {
  const lineRef = useRef<HTMLDivElement>(null);
  const pixelsPerSecond = useUIStore((s) => s.pixelsPerSecond);

  useEffect(() => {
    let frame: number;

    const tick = () => {
      const position = engine.transport.getPosition();
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
