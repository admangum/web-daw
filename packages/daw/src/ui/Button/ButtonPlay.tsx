import { Fill } from "@/ui/icons";
import { ButtonBase, type IconButtonProps } from "./ButtonBase";
import { cx } from "@/util";

export function ButtonPlay({ className, ...props }: IconButtonProps) {
  return (
    <ButtonBase
      className={cx("group flex items-center justify-center rounded-full", className)}
      {...props}
    >
      <Fill.Play className="size-icon" />
    </ButtonBase>
  );
}
