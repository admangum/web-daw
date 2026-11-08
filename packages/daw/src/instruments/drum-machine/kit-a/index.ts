import kick from "./kick-02.wav";
import snare from "./snare-02.wav";
import hihat from "./hihat-closed-01.wav";
import clap from "./clap-01.wav";
import type { SampleURLMap } from "audio-engine";

export default {
  C3: kick,
  Db3: snare,
  D3: hihat,
  Eb3: clap,
} satisfies SampleURLMap;
