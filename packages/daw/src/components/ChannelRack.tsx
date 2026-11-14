import { cx } from "@/util";
import { useProjectStore } from "../stores/useProjectStore";
import { useUIStore } from "../stores/useUIStore";

interface Props {
  className?: string;
}

export function ChannelRack({ className }: Props) {
  const selectedTrackId = useUIStore((s) => s.selectedTrackId);
  const track = useProjectStore((s) => s.tracks.find((t) => t.id === selectedTrackId));

  if (!track) return null;

  return (
    <div
      className={cx(
        `h-52 opacity-100 transition-all duration-250 ease-out starting:h-0 starting:opacity-0`,
        className
      )}
    >
      <div className="flex h-full shrink-0 items-start gap-2 border-t border-slate-700 p-3">
        {/* 
          Channel rack components (Instrument, filters, etc) to go here
        */}
      </div>
    </div>
  );
}
