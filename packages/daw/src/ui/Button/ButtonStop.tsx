import { Fill } from "@/ui/icons";
import { ButtonBase } from "./ButtonBase";
import { cx } from "@/util";

interface Props {
  className?: string;
  onClick?: () => void;
}
export function ButtonStop({ className, onClick }: Props) {
  return (
    <ButtonBase
      className={cx("flex items-center justify-center rounded-full", className)}
      onClick={onClick}
    >
      <Fill.Stop className="size-icon translate-x-[-2px] translate-y-[0px] fill-red-600/80" />
    </ButtonBase>
  );
}
