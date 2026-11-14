import { cx } from "@/util";
import { type PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  className?: string;
  spacing: number;
}

export function Grid({ spacing, className, children }: Props) {
  return (
    <div
      className={cx("relative", className)}
      style={{
        backgroundImage: `repeating-linear-gradient(90deg, var(--color-slate-700) 0px, transparent 1px, transparent ${spacing}px)`,
      }}
    >
      {children}
    </div>
  );
}
