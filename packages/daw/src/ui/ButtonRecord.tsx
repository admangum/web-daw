import { Fill } from "./icons";
import { Button } from "./Button";
import { cx } from "@/util";

interface Props {
  className?: string;
}
export function ButtonRecord({ className }: Props) {
  return (
    <Button className={cx("flex items-center justify-center rounded-r-full", className)}>
      <Fill.Record className="size-icon translate-x-[-2px] translate-y-[0px]" />
    </Button>
  );
}
