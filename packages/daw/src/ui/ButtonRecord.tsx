import { Fill } from "./icons";
import { Button } from "./Button";
import { cx } from "@/util";

interface Props {
  className?: string;
}
export function ButtonRecord({ className }: Props) {
  return (
    <Button className={cx("group flex items-center justify-center rounded-full", className)}>
      <Fill.Record className="size-icon" />
    </Button>
  );
}
