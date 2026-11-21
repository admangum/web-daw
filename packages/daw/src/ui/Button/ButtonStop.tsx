import { Fill } from "@/ui/icons";
import { ButtonBase, type IconButtonProps } from "./ButtonBase";
import { cx } from "@/util";

export function ButtonStop({ className, ...props }: IconButtonProps) {
  return (
    <ButtonBase
      className={cx("flex items-center justify-center rounded-full", className)}
      {...props}
    >
      <Fill.Stop className="size-icon translate-x-[-2px] translate-y-[0px] fill-red-600/80" />
    </ButtonBase>
  );
}
