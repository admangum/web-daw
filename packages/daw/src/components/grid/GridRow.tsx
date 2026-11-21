import { cx } from "@/util";
import { type CSSProperties, type PropsWithChildren, type MouseEvent } from "react";

interface Props extends PropsWithChildren {
  id: string;
  className?: string;
  style?: CSSProperties;
  onGridRowClick?: (e: MouseEvent<HTMLDivElement>, id: string) => void;
}

export function GridRow({ id, className, style, onGridRowClick, children }: Props) {
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    // Only trigger if the click target is the grid row itself
    if (e.currentTarget === e.target && onGridRowClick) {
      onGridRowClick(e, id);
    }
  };
  return (
    <div
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
