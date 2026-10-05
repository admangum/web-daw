// import Play from '@/ui/svg'
import { cx } from "@/util";
import { ButtonPlay } from "./ButtonPlay";
import { ButtonRecord } from "./ButtonRecord";

interface Props {
  className?: string;
}
export function ButtonComboPlayRecord({ className }: Props) {
  return (
    <div className={cx("flex gap-0.5 h-12 fill-slate-300", className)}>
      <ButtonPlay />
      <ButtonRecord />
    </div>
  );
}
