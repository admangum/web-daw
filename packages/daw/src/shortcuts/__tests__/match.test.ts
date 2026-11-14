import { describe, expect, it } from "vitest";
import { isEditableTarget, matchesShortcut } from "../match";
import type { KeyEventLike, Shortcut } from "../types";

const ev = (o: Partial<KeyEventLike> = {}): KeyEventLike => ({
  code: "Space",
  shiftKey: false,
  ctrlKey: false,
  altKey: false,
  metaKey: false,
  ...o,
});
const sc = (o: Partial<Shortcut> = {}): Shortcut => ({
  id: "x",
  code: "Space",
  run: () => {},
  ...o,
});

describe("matchesShortcut", () => {
  it("matches plain key", () => expect(matchesShortcut(ev(), sc())).toBe(true));
  it("plain shortcut ignores shifted press", () =>
    expect(matchesShortcut(ev({ shiftKey: true }), sc())).toBe(false));
  it("shift shortcut requires shift", () => {
    expect(matchesShortcut(ev({ shiftKey: true }), sc({ shift: true }))).toBe(true);
    expect(matchesShortcut(ev(), sc({ shift: true }))).toBe(false);
  });
  it("rejects extra modifiers", () => {
    expect(matchesShortcut(ev({ ctrlKey: true }), sc())).toBe(false);
    expect(matchesShortcut(ev({ metaKey: true }), sc())).toBe(false);
  });
  it("rejects other keys", () => expect(matchesShortcut(ev({ code: "KeyA" }), sc())).toBe(false));
});

describe("isEditableTarget", () => {
  it("detects inputs", () => expect(isEditableTarget(document.createElement("input"))).toBe(true));
  it("detects listbox descendants", () => {
    const box = document.createElement("div");
    box.setAttribute("role", "listbox");
    const child = document.createElement("span");
    box.appendChild(child);
    expect(isEditableTarget(child)).toBe(true);
  });
  it("ignores buttons and null", () => {
    expect(isEditableTarget(document.createElement("button"))).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
  });
});
