import { Regular } from "@/ui/icons";
import { ButtonBase } from "./ButtonBase";
import { cx } from "@/util";

interface Props {
  className?: string;
  onClick?: () => void;
}
export function ButtonClose({ className, onClick }: Props) {
  return (
    <ButtonBase className={cx("size-8 rounded-full", className)} onClick={onClick}>
      <Regular.X className="size-icon translate-y-[0px]" />
    </ButtonBase>
  );
}
