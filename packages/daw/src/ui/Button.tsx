import React from "react";
import { cx } from "../util";

interface Props extends React.ComponentPropsWithRef<"button"> {
  className?: string;
}
export function Button({ children, ref, className, ...props }: React.PropsWithChildren<Props>) {
  return (
    <button
      className={cx(
        "rounded bg-slate-800 text-sm font-medium cursor-pointer text-slate-200 hover:bg-slate-700",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
}
