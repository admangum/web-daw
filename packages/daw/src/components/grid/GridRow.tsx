import { cx } from "@/util";
import { type CSSProperties, type PropsWithChildren, type MouseEvent, useRef } from "react";

interface Props extends PropsWithChildren {
  id: string;
  className?: string;
  style?: CSSProperties;
  onGridRowClick?: (e: MouseEvent<HTMLDivElement>, id: string) => void;
}

export function GridRow({ id, className, style, onGridRowClick, children }: Props) {
  const gridRowRef = useRef<HTMLDivElement | null>(null);
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (gridRowRef.current === e.target && onGridRowClick) {
      onGridRowClick(e, id);
    }
  };
  return (
    <div
      ref={gridRowRef}
      key={id}
      onClick={onClick}
      style={style}
      className={cx(
        "relative box-border flex w-full items-center border-b border-slate-700",
        className
      )}
    >
      {children}
    </div>
  );
}
