import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  id: string;
  height: number;
  pixelsPerColumn: number;
}

export function GridRow({ id, height, pixelsPerColumn, children, ...props }: Props) {
  return (
    <div
      {...props}
      data-midi-note={id}
      className="relative flex items-center box-border border-b border-slate-700 w-full"
      style={{
        height: `${height}px`,
        backgroundImage: `repeating-linear-gradient(90deg, var(--color-slate-700) 0px, transparent 1px, transparent ${pixelsPerColumn}px)`,
      }}
    >
      {children}
    </div>
  );
}
