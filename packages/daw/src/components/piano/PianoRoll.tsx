import React from "react";
import { Keyboard } from "./Keyboard";
import { KEY_HEIGHT, MIDI_NOTE_COUNT, NOTES_TOP_DOWN } from "./constants";
import { scrollTopForNote } from "./util/key-layout";
import { Grid } from "./Grid";
import { TimeRuler } from "../Timeline";
import { TimeRulerSpacer } from "../TimeRulerSpacer";

interface Props {
  /** Scrolls the keyboard to center this MIDI note whenever it changes. */
  scrollToNote?: number;
}
export function PianoRoll({ scrollToNote }: Props) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const hasScrolledRef = React.useRef(false);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el || scrollToNote === undefined) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const smooth = hasScrolledRef.current && !reduceMotion;
    hasScrolledRef.current = true;
    el.scrollTo({
      top: scrollTopForNote(scrollToNote, el.clientHeight),
      behavior: smooth ? "smooth" : "instant",
    });
  }, [scrollToNote]);
  return (
    <div>
      <div id="header" className="flex">
        <div className="w-36 shrink-0">
          <TimeRulerSpacer />
        </div>
        <TimeRuler />
      </div>
      <div
        id="body"
        ref={scrollRef}
        className="flex w-full h-full overflow-y-auto overflow-x-hidden border-inherit"
      >
        <div className="shrink-0 w-36 border-r border-inherit">
          <Keyboard />
        </div>
        <div
          className="overflow-x-auto overflow-y-hidden border-inherit"
          style={{ height: MIDI_NOTE_COUNT * KEY_HEIGHT }}
        >
          <Grid />
        </div>
      </div>
    </div>
  );
}
