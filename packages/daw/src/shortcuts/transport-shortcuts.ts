import { pause, play, stop } from "../engine/sync";
import { useTransportStore } from "../stores/useTransportStore";
import type { Shortcut } from "./types";

const isPlaying = () => useTransportStore.getState().isPlaying;

export const transportShortcuts: Shortcut[] = [
  {
    id: "transport.toggle-play",
    code: "Space",
    run: () => {
      if (isPlaying()) stop();
      else void play();
    },
  },
  {
    id: "transport.pause",
    code: "Space",
    shift: true,
    when: isPlaying,
    run: () => pause(),
  },
];
