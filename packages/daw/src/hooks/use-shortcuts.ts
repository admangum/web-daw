import { useEffect, useEffectEvent } from "react";
import { isEditableTarget, matchesShortcut } from "../shortcuts/match";
import type { Shortcut } from "../shortcuts/types";

/** Registers a global keydown listener that dispatches to the given shortcuts. */
export function useShortcuts(shortcuts: Shortcut[]) {
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    console.log("event: ", event);
    if (event.repeat || event.isComposing || isEditableTarget(event.target)) return;
    const shortcut = shortcuts.find((s) => matchesShortcut(event, s) && (s.when?.() ?? true));
    if (!shortcut) return;
    // Also stops a focused button from receiving a click on Space.
    event.preventDefault();
    shortcut.run();
  });

  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKeyDown(e);
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);
}
