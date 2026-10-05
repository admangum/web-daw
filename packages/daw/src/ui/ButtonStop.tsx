import { Fill } from "./icons";
import { Button } from "./Button";

interface Props {
  onClick?: () => void;
}
export function ButtonStop({ onClick }: Props) {
  return (
    <Button className="flex items-center justify-center rounded-full" onClick={onClick}>
      <Fill.Stop className="size-icon translate-x-[-2px] translate-y-[0px]" />
    </Button>
  );
}
