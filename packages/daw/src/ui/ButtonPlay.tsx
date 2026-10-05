import { Fill } from "./icons";
import { Button } from "./Button";
import { cx } from "@/util";

interface Props {
  className?: string;
  onClick?: () => void;
}
export function ButtonPlay({ className, onClick }: Props) {
  return (
    <Button
      className={cx("flex items-center justify-center rounded-l-full", className)}
      onClick={onClick}
    >
      <Fill.Play className="size-icon translate-x-[2px] translate-y-[0px]" />
    </Button>
  );
}
