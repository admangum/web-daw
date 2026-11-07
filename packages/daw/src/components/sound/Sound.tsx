import type { SoundData } from "../../stores/types";
// import { useClickHandlers, usePressAndHold } from "../../hooks";

interface Pos {
  x: number;
  y: number;
}

interface Size {
  width: number;
}

interface Props {
  sound: SoundData;
  onClick: (sound: SoundData) => void;
  pos: Pos;
  size: Size;
}
export function Sound({ sound, onClick, pos, size, ...props }: Props) {
  const onSoundClick = () => {
    onClick(sound);
  };

  return (
    <div
      {...props}
      onClick={onSoundClick}
      className="absolute h-full cursor-pointer bg-slate-700/80 overflow-hidden transition-colors delay-100 duration-300 active:bg-slate-400/80 hover:bg-slate-500/80"
      style={{
        translate: `${pos.x}px var(--tw-translate-y)`,
        width: size.width,
      }}
    ></div>
  );
}
