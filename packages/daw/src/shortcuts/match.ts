import type { KeyEventLike, Shortcut } from "./types";

/** Exact match: modifiers not listed on the shortcut must not be pressed. */
export function matchesShortcut(event: KeyEventLike, shortcut: Shortcut): boolean {
  return (
    event.code === shortcut.code &&
    event.shiftKey === !!shortcut.shift &&
    event.ctrlKey === !!shortcut.ctrl &&
    event.altKey === !!shortcut.alt &&
    event.metaKey === !!shortcut.meta
  );
}

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !("tagName" in target)) return false;
  const el = target as HTMLElement;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable || el.getAttribute?.("contenteditable") === "true") return true;
  return !!el.closest?.('[role="listbox"]');
}
