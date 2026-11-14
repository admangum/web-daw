import { useEffect } from "react";
import { isEditableTarget, matchesShortcut } from "../shortcuts/match";
import type { Shortcut } from "../shortcuts/types";

/** Registers a global keydown listener that dispatches to the given shortcuts. */
export function useShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.isComposing || isEditableTarget(event.target)) return;
      const shortcut = shortcuts.find((s) => matchesShortcut(event, s) && (s.when?.() ?? true));
      if (!shortcut) return;
      // Also stops a focused button from receiving a click on Space.
      event.preventDefault();
      shortcut.run();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [shortcuts]);
}
