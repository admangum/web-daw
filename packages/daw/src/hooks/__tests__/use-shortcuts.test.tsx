import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Shortcut } from "../../shortcuts/types";
import { useShortcuts } from "../use-shortcuts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function Harness({ shortcuts }: { shortcuts: Shortcut[] }) {
  useShortcuts(shortcuts);
  return null;
}

const makeShortcut = (overrides: Partial<Shortcut> = {}): Shortcut => ({
  id: "test.shortcut",
  code: "Space",
  run: vi.fn(),
  ...overrides,
});

let container: HTMLDivElement;
let root: Root | null;

function render(shortcuts: Shortcut[]) {
  act(() => {
    root!.render(<Harness shortcuts={shortcuts} />);
  });
}

function unmount() {
  act(() => {
    root?.unmount();
  });
  root = null;
}

/** Dispatches a bubbling keydown and returns the event so callers can inspect defaultPrevented. */
function keydown(init: KeyboardEventInit = {}, target: EventTarget = document.body) {
  const event = new KeyboardEvent("keydown", {
    code: "Space",
    bubbles: true,
    cancelable: true,
    ...init,
  });
  target.dispatchEvent(event);
  return event;
}

const keydownRegistrations = (spy: { mock: { calls: unknown[][] } }) =>
  spy.mock.calls.filter(([type]) => type === "keydown");

describe("useShortcuts", () => {
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    unmount();
    container.remove();
    vi.restoreAllMocks();
  });

  it("runs the matching shortcut and prevents the default action", () => {
    const shortcut = makeShortcut();
    render([shortcut]);

    const event = keydown();

    expect(shortcut.run).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it("ignores keys that don't match any shortcut", () => {
    const shortcut = makeShortcut({ code: "Space" });
    render([shortcut]);

    const event = keydown({ code: "KeyA" });

    expect(shortcut.run).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it("requires modifiers to match exactly", () => {
    const plain = makeShortcut({ id: "plain", run: vi.fn() });
    const shifted = makeShortcut({ id: "shifted", shift: true, run: vi.fn() });
    render([plain, shifted]);

    keydown({ shiftKey: true });

    expect(shifted.run).toHaveBeenCalledTimes(1);
    expect(plain.run).not.toHaveBeenCalled();
  });

  it("does not run or prevent default when the `when` guard is false", () => {
    const shortcut = makeShortcut({ when: () => false });
    render([shortcut]);

    const event = keydown();

    expect(shortcut.run).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it("evaluates the `when` guard at key press time", () => {
    let enabled = false;
    const shortcut = makeShortcut({ when: () => enabled });
    render([shortcut]);

    keydown();
    expect(shortcut.run).not.toHaveBeenCalled();

    enabled = true;
    keydown();
    expect(shortcut.run).toHaveBeenCalledTimes(1);
  });

  it("ignores auto-repeated key events", () => {
    const shortcut = makeShortcut();
    render([shortcut]);

    keydown({ repeat: true });

    expect(shortcut.run).not.toHaveBeenCalled();
  });

  it("ignores key presses that originate in editable elements", () => {
    const shortcut = makeShortcut();
    render([shortcut]);
    const input = document.createElement("input");
    document.body.appendChild(input);

    const event = keydown({}, input);
    input.remove();

    expect(shortcut.run).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it("registers the keydown listener once, even when re-rendered with a new array", () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");

    render([makeShortcut()]);
    render([makeShortcut()]);
    render([makeShortcut()]);

    expect(keydownRegistrations(addSpy)).toHaveLength(1);
    expect(keydownRegistrations(removeSpy)).toHaveLength(0);
  });

  it("uses the latest shortcuts after a re-render", () => {
    const first = makeShortcut({ run: vi.fn() });
    const second = makeShortcut({ run: vi.fn() });
    render([first]);
    render([second]);

    keydown();

    expect(first.run).not.toHaveBeenCalled();
    expect(second.run).toHaveBeenCalledTimes(1);
  });

  it("removes the listener on unmount", () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");
    const shortcut = makeShortcut();
    render([shortcut]);

    unmount();
    keydown();

    expect(shortcut.run).not.toHaveBeenCalled();
    const [[, added]] = keydownRegistrations(addSpy);
    expect(keydownRegistrations(removeSpy)).toEqual([["keydown", added]]);
  });
});
