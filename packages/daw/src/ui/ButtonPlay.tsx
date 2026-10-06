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
      className={cx("flex items-center justify-center rounded-full group", className)}
      onClick={onClick}
    >
      <Fill.Play className="size-icon" />
    </Button>
  );
}
