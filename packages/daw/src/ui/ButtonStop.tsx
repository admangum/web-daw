import { Fill } from "./icons";
import { Button } from "./Button";
import { cx } from "@/util";

interface Props {
  className?: string;
  onClick?: () => void;
}
export function ButtonStop({ className, onClick }: Props) {
  return (
    <Button
      className={cx("flex items-center justify-center rounded-full", className)}
      onClick={onClick}
    >
      <Fill.Stop className="size-icon translate-x-[-2px] translate-y-[0px] fill-red-600/80" />
    </Button>
  );
}
