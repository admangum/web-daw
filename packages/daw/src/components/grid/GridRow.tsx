import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  id: string;
}

export function GridRow({ id, children, ...props }: Props) {
  return (
    <div
      {...props}
      data-grid-row-id={id}
      className="c-grid-row relative box-border flex w-full items-center border-b border-slate-700"
      style={{
        height: `var(--grid-row-height)`,
        backgroundImage: `repeating-linear-gradient(90deg, var(--color-slate-700) 0px, transparent 1px, transparent var(--pixels-per-grid-line))`,
      }}
    >
      {children}
    </div>
  );
}
