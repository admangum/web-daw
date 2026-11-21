import { Regular } from "@/ui/icons";
import { ButtonBase, type IconButtonProps } from "./ButtonBase";
import { cx } from "@/util";

export function ButtonClose({ className, ...props }: IconButtonProps) {
  return (
    <ButtonBase className={cx("size-8 rounded-full", className)} {...props}>
      <Regular.X className="size-icon translate-y-[0px]" />
    </ButtonBase>
  );
}
