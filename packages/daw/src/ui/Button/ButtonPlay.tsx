import { Fill } from "@/ui/icons";
import { ButtonBase } from "./ButtonBase";
import { cx } from "@/util";

interface Props {
  className?: string;
  onClick?: () => void;
}
export function ButtonPlay({ className, onClick }: Props) {
  return (
    <ButtonBase
      className={cx("flex items-center justify-center rounded-full group", className)}
      onClick={onClick}
    >
      <Fill.Play className="size-icon" />
    </ButtonBase>
  );
}
