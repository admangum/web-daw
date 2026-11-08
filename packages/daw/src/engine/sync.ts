import { Clip, Sound, type MidiNote, type Note } from "audio-engine";
import { engine } from "./engine";
import { useProjectStore } from "../stores/useProjectStore";
import { useTransportStore } from "../stores/useTransportStore";
import type { ClipData, TrackData } from "../stores/types";
import { DEFAULT_INSTRUMENT_ID, getInstrumentDef } from "../instruments/catalog";
import { useUIStore } from "../stores/useUIStore";

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
      const sounds: Sound[] = [];
      for (const sound of clip.sounds) {
        sounds.push(
          new Sound({
            id: sound.id,
            clipId: clip.id,
            startTime: sound.startTime,
            duration: sound.duration,
            offset: sound.offset,
            midiNote: sound.midiNote,
          })
        );
      }
      return new Clip({
        id: clip.id,
        trackId: clip.trackId,
        startTime: clip.startTime,
        duration: clip.duration,
        offset: clip.offset,
        sounds,
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
  const instrumentDef = getInstrumentDef(DEFAULT_INSTRUMENT_ID);
  engine.addTrack({ id, name, volume: track.volume, instrumentDef });
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
  const instrumentDef = getInstrumentDef(instrumentId);
  if (instrumentDef && track) {
    track?.setInstrument(instrumentDef);
  }
}

export function playTrackInstrument(id: string, note: Note | MidiNote): void {
  const track = engine.getTrack(id);
  track?.playInstrument(note);
}

export function addClipAt(trackId: string, startTime: number): void {
  const duration = 5;

  const clip: ClipData = {
    id: crypto.randomUUID(),
    trackId,
    startTime: Math.max(0, startTime),
    duration,
    offset: 0,
    sounds: [],
  };
  useProjectStore.getState().addClip(clip);
  pushClipsToEngine();
}

export function removeClip(id: string): void {
  useProjectStore.getState().removeClip(id);
  pushClipsToEngine();
}

export function addSoundAt(
  clip: ClipData,
  midiNote: MidiNote,
  startTime: number,
  duration: number = 0.5
) {
  const sound = {
    id: crypto.randomUUID(),
    clipId: clip.id,
    startTime: Math.max(0, startTime),
    duration,
    offset: 0,
    midiNote,
  };
  clip.sounds.push(sound);
  useProjectStore.getState().updateClip(clip.id, clip);
  pushClipsToEngine();
}

export function removeSound(clip: ClipData, id: string) {
  const soundIdx = clip.sounds.findIndex((s) => s.id === id);
  if (soundIdx > -1) {
    clip.sounds.splice(soundIdx, 1);
    useProjectStore.getState().updateClip(clip.id, clip);
    pushClipsToEngine();
  }
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
  const editingClipId = useUIStore.getState().editingClipId;
  if (editingClipId) {
    const editingClip = useProjectStore.getState().getClip(editingClipId);
    useTransportStore.getState().setPlaybackPosition(editingClip.startTime);
    engine.transport.seek(editingClip.startTime);
  } else {
    useTransportStore.getState().setPlaybackPosition(0);
  }
}

export function seek(position: number): void {
  engine.transport.seek(position);
  useTransportStore.getState().setPlaybackPosition(position);
}

export function getTransportPosition(): number {
  return engine.transport.getPosition();
}
