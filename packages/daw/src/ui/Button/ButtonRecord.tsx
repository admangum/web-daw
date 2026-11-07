import { Fill } from "@/ui/icons";
import { ButtonBase } from "./ButtonBase";
import { cx } from "@/util";

interface Props {
  className?: string;
}
export function ButtonRecord({ className }: Props) {
  return (
    <ButtonBase className={cx("group flex items-center justify-center rounded-full", className)}>
      <Fill.Record className="size-icon" />
    </ButtonBase>
  );
}
