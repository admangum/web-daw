import React, { useEffect, useRef } from "react";

const DEFAULT_THRESHOLD_MILLISECONDS = 250;

type Milliseconds = number;

interface Options {
  /**
   * Time in milliseconds before
   * callback is triggered
   */
  threshold?: Milliseconds;
}

export function usePressAndHold(
  onPressAndHold: (event: React.PointerEvent) => void,
  { threshold = DEFAULT_THRESHOLD_MILLISECONDS }: Options = {}
) {
  const timer = useRef<number | null>(null);
  const callback = useRef(onPressAndHold);

  useEffect(() => {
    callback.current = onPressAndHold;
  });

  function clear() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  useEffect(() => clear, []);

  const onPointerDown = (event: React.PointerEvent) => {
    clear();
    timer.current = window.setTimeout(() => {
      timer.current = null;
      callback.current(event);
    }, threshold);
  };

  return { onPointerDown, onPointerUp: clear, onPointerLeave: clear, onPointerCancel: clear };
}
