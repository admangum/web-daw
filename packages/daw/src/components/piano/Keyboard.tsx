import { memo, useMemo, useRef, useState } from "react";
import { cx } from "@/util";
import { KEY_HEIGHT, MIDI_NOTE_COUNT, NOTES_TOP_DOWN } from "./constants";
import { isBlackKey, isC, noteName } from "./util/key-layout";
import type { MidiNote } from "audio-engine";

interface KeyboardProps {
  /** Called with the key's MIDI note when it is pressed. */
  onKeyPress?: (midiNote: MidiNote) => void;
  /** Called with the key's MIDI note when the pointer releases it or leaves it while dragging. */
  onKeyRelease?: (midiNote: MidiNote) => void;
  /** MIDI notes to display as pressed, in addition to any held by the pointer. */
  pressedNotes?: MidiNote[];

  className?: string;
}

const NO_NOTES: MidiNote[] = [];

function noteFromElement(el: Element | null) {
  const value = el?.closest<HTMLElement>("[data-note]")?.dataset.note;
  return value === undefined ? null : (Number(value) as MidiNote);
}

export function Keyboard({
  onKeyPress,
  onKeyRelease,
  pressedNotes = NO_NOTES,
  className,
}: KeyboardProps) {
  const heldRef = useRef<MidiNote | null>(null);
  const [heldNote, setHeldNote] = useState<MidiNote | null>(null);

  const pressed = useMemo(() => {
    const set = new Set(pressedNotes);
    if (heldNote !== null) set.add(heldNote);
    return set;
  }, [pressedNotes, heldNote]);

  function hold(note: MidiNote | null) {
    const previous = heldRef.current;
    if (previous === note) return;
    heldRef.current = note;
    setHeldNote(note);
    if (previous !== null) onKeyRelease?.(previous);
    if (note !== null) onKeyPress?.(note);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    const note = noteFromElement(e.target as Element);
    if (note === null) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    hold(note);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (heldRef.current === null) return;
    // With pointer capture the event target is always the container, so hit-test instead.
    const note = noteFromElement(document.elementFromPoint(e.clientX, e.clientY));
    if (note !== null) hold(note);
  }

  function handlePointerEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    hold(null);
  }

  return (
    <div
      role="group"
      aria-label="Piano keyboard"
      className={cx("touch-pan-y overflow-x-hidden bg-slate-200 select-none", className)}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <div style={{ height: MIDI_NOTE_COUNT * KEY_HEIGHT }}>
        {NOTES_TOP_DOWN.map((note) => (
          <KeyboardKey key={note} note={note} pressed={pressed.has(note)} />
        ))}
      </div>
    </div>
  );
}

const KeyboardKey = memo(function KeyboardKey({
  note,
  pressed,
}: {
  note: MidiNote;
  pressed: boolean;
}) {
  const black = isBlackKey(note);
  const faceColor = black
    ? pressed
      ? "bg-slate-800 shadow-sm"
      : "bg-slate-900 shadow-md"
    : pressed
      ? "bg-slate-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]"
      : "bg-slate-100";
  return (
    <div
      data-note={note}
      data-pressed={pressed || undefined}
      aria-label={noteName(note)}
      aria-pressed={pressed}
      className={cx(
        "relative box-border w-full cursor-pointer border-b border-slate-400",
        black ? "bg-slate-200" : "bg-slate-100"
      )}
      style={{ height: KEY_HEIGHT }}
    >
      <div
        className={cx(
          "absolute inset-y-0 left-0 transition-[transform,background-color,box-shadow] duration-75 ease-out",
          black ? "w-3/5 rounded-r-sm" : "w-full",
          pressed ? "translate-x-0.5" : undefined,
          faceColor
        )}
      />
      {isC(note) && (
        <span className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 text-[10px] leading-none text-slate-600">
          {noteName(note)}
        </span>
      )}
    </div>
  );
});
