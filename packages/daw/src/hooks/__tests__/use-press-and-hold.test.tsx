import { act, type PointerEvent as ReactPointerEvent } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePressAndHold } from "../use-press-and-hold";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

type OnHold = (event: ReactPointerEvent) => void;

interface HarnessProps {
  onHold: OnHold;
  threshold?: number;
  /** Changing this forces a re-render without changing the hook's inputs. */
  rev?: number;
}

function Harness({ onHold, threshold, rev = 0 }: HarnessProps) {
  const handlers = usePressAndHold(onHold, { threshold });
  return <button data-rev={rev} {...handlers} />;
}

let container: HTMLDivElement;
let root: Root | null;

function render(props: HarnessProps) {
  act(() => {
    root!.render(<Harness {...props} />);
  });
}

function unmount() {
  act(() => {
    root?.unmount();
  });
  root = null;
}

const target = () => container.querySelector("button")!;

/**
 * Dispatch a bubbling pointer event on the button. React derives `onPointerLeave`
 * from `pointerout`/`pointerover` (not the native `pointerleave`), so leaving is
 * simulated with a `pointerout` that has no relatedTarget.
 */
function fire(type: "pointerdown" | "pointerup" | "pointerout" | "pointercancel") {
  const EventCtor = typeof PointerEvent !== "undefined" ? PointerEvent : MouseEvent;
  act(() => {
    target().dispatchEvent(new EventCtor(type, { bubbles: true, cancelable: true }));
  });
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe("usePressAndHold", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    unmount();
    container.remove();
    vi.useRealTimers();
  });

  it("fires the callback once after the threshold, with the pointerdown event", () => {
    const onHold = vi.fn();
    render({ onHold, threshold: 300 });

    fire("pointerdown");
    advance(300);

    expect(onHold).toHaveBeenCalledTimes(1);
    expect(onHold).toHaveBeenCalledWith(expect.objectContaining({ type: "pointerdown" }));
  });

  it("does not fire before the threshold", () => {
    const onHold = vi.fn();
    render({ onHold, threshold: 300 });

    fire("pointerdown");
    advance(299);

    expect(onHold).not.toHaveBeenCalled();
  });

  it("defaults to a 250ms threshold", () => {
    const onHold = vi.fn();
    render({ onHold });

    fire("pointerdown");
    advance(249);
    expect(onHold).not.toHaveBeenCalled();

    advance(1);
    expect(onHold).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["pointerup", "pointerup"],
    ["pointer leave", "pointerout"],
    ["pointercancel", "pointercancel"],
  ] as const)("cancels the hold on %s before the threshold", (_label, type) => {
    const onHold = vi.fn();
    render({ onHold, threshold: 300 });

    fire("pointerdown");
    advance(100);
    fire(type);
    advance(1000);

    expect(onHold).not.toHaveBeenCalled();
  });

  it("keeps the timer running across a re-render while holding", () => {
    const onHold = vi.fn();
    render({ onHold, threshold: 300, rev: 0 });

    fire("pointerdown");
    advance(100);
    render({ onHold, threshold: 300, rev: 1 });
    advance(200);

    expect(onHold).toHaveBeenCalledTimes(1);
  });

  it("replaces the previous timer on a second pointerdown instead of orphaning it", () => {
    const onHold = vi.fn();
    render({ onHold, threshold: 300 });

    fire("pointerdown");
    advance(200);
    fire("pointerdown");
    advance(1000);

    expect(onHold).toHaveBeenCalledTimes(1);
  });

  it("cancels the hold when unmounted", () => {
    const onHold = vi.fn();
    render({ onHold, threshold: 300 });

    fire("pointerdown");
    advance(100);
    unmount();
    advance(1000);

    expect(onHold).not.toHaveBeenCalled();
  });

  it("calls the latest callback if it changes before the timer fires", () => {
    const first = vi.fn();
    const second = vi.fn();
    render({ onHold: first, threshold: 300 });

    fire("pointerdown");
    advance(100);
    render({ onHold: second, threshold: 300 });
    advance(200);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
