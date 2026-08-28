import { Clip, type PitchNotation } from "audio-engine";
import { engine } from "./engine";
import { getBuffer, registerBuffer } from "./bufferCache";
import { createDemoClipBuffer } from "./synth";
import { useProjectStore } from "../stores/useProjectStore";
import { useTransportStore } from "../stores/useTransportStore";
import type { ClipData, TrackData } from "../stores/types";
import { DEFAULT_INSTRUMENT_ID, INSTRUMENT_MAP } from "../instruments/catalog";

/**
 * The only module allowed to translate between useProjectStore's plain
 * ClipData/TrackData and audio-engine's live Track/Clip graph. Components
 * and store actions should call these functions rather than reaching into
 * `engine` or the store's setters directly.
 */

function pushClipsToEngine(): void {
  const clips = useProjectStore.getState().clips;
  const engineClips = clips
    .map((clip) => {
      const buffer = getBuffer(clip.bufferId);
      if (!buffer) return null;
      return new Clip({
        id: clip.id,
        trackId: clip.trackId,
        startTime: clip.startTime,
        duration: clip.duration,
        offset: clip.offset,
        buffer,
      });
    })
    .filter((clip): clip is Clip => clip !== null);

  engine.setClips(engineClips);
}

export function addTrack(name: string): void {
  const id = crypto.randomUUID();
  const track: TrackData = {
    id,
    name,
    volume: 1,
    muted: false,
    soloed: false,
    instrumentId: DEFAULT_INSTRUMENT_ID,
  };
  engine.addTrack({ id, name, volume: track.volume });
  useProjectStore.getState().addTrack(track);
}

export function removeTrack(id: string): void {
  engine.removeTrack(id);
  useProjectStore.getState().removeTrack(id);
  pushClipsToEngine();
}

export function setTrackVolume(id: string, volume: number): void {
  const track = engine.getTrack(id);
  track?.volume.setValueAtTime(volume, engine.context.currentTime);
  useProjectStore.getState().updateTrack(id, { volume });
}

export function setTrackMuted(id: string, muted: boolean): void {
  engine.mixer.setMuted(id, muted);
  useProjectStore.getState().updateTrack(id, { muted });
}

export function setTrackSoloed(id: string, soloed: boolean): void {
  engine.mixer.setSoloed(id, soloed);
  useProjectStore.getState().updateTrack(id, { soloed });
}

export function setTrackInstrument(id: string, instrumentId: string): void {
  useProjectStore.getState().updateTrack(id, { instrumentId });
  const track = engine.getTrack(id);
  const instrumentDef = INSTRUMENT_MAP.get(instrumentId);
  if (instrumentDef && track) {
    track?.setInstrument(instrumentDef);
  }
}

export function playTrackInstrument(id: string, note: PitchNotation): void {
  const track = engine.getTrack(id);
  track?.playInstrument(note);
}

export function addClipAt(trackId: string, startTime: number): void {
  const duration = 0.5;
  const buffer = createDemoClipBuffer(engine.context, duration);
  const bufferId = crypto.randomUUID();
  registerBuffer(bufferId, buffer);

  const clip: ClipData = {
    id: crypto.randomUUID(),
    trackId,
    startTime: Math.max(0, startTime),
    duration,
    offset: 0,
    bufferId,
  };
  useProjectStore.getState().addClip(clip);
  pushClipsToEngine();
}

export function removeClip(id: string): void {
  useProjectStore.getState().removeClip(id);
  pushClipsToEngine();
}

export async function play(): Promise<void> {
  await engine.play();
  useTransportStore.getState().setIsPlaying(true);
}

export function pause(): void {
  engine.pause();
  useTransportStore.getState().setIsPlaying(false);
  useTransportStore.getState().setPlaybackPosition(engine.transport.getPosition());
}

export function stop(): void {
  engine.stop();
  useTransportStore.getState().setIsPlaying(false);
  useTransportStore.getState().setPlaybackPosition(0);
}

export function seek(position: number): void {
  engine.transport.seek(position);
  useTransportStore.getState().setPlaybackPosition(position);
}
