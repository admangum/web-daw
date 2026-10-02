import React from "react";

const SINGLE_CLICK_THRESHOLD_MILLISECONDS = 200;

export function useClickHandlers(
  onClick: (...args: any[]) => void,
  onDoubleClick: (...args: any[]) => void
) {
  let timer = React.useRef<number | null>(null);

  const onClickProxy = React.useCallback(
    function onClickProxy(...args: any[]) {
      if (typeof timer.current === "number") {
        console.log("clear timer and set to null");
        clearTimeout(timer.current);
        timer.current = null;
      } else {
        console.log("set timer");
        timer.current = setTimeout(() => {
          onClick(...args);
          timer.current = null;
        }, SINGLE_CLICK_THRESHOLD_MILLISECONDS);
      }
    },
    [onClick]
  );
  const onDoubleClickProxy = React.useCallback(
    function onDoubleClickProxy(...args: any[]) {
      onDoubleClick(...args);
    },
    [onDoubleClick]
  );

  return [onClickProxy, onDoubleClickProxy];
}
