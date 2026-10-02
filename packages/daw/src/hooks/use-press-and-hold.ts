import React from "react";

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
  onPressAndHold: (event: React.MouseEvent) => void,
  options: Options = {}
) {
  const { threshold } = Object.assign({ threshold: DEFAULT_THRESHOLD_MILLISECONDS }, options);
  const timer = React.useRef<number | null>(null);

  const onMouseDown = (event: React.MouseEvent) => {
    timer.current = setTimeout(() => {
      onPressAndHold(event);
      timer.current = null;
    }, threshold);
  };

  const onMouseUp = () => {
    if (typeof timer.current === "number") {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  React.useEffect(() => () => {
    if (typeof timer.current === "number") {
      clearInterval(timer.current);
      timer.current = null;
    }
  });

  return [onMouseDown, onMouseUp] as const;
}
