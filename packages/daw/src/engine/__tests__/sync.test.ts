import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MidiNote } from "audio-engine";

vi.mock("../engine", () => ({
  engine: {
    stop: vi.fn(),
    getTrack: vi.fn(),
    setClips: vi.fn(),
    transport: { seek: vi.fn(), getPosition: vi.fn(() => 0) },
  },
}));

import { engine } from "../engine";
import { useProjectStore } from "../../stores/useProjectStore";
import { useTransportStore } from "../../stores/useTransportStore";
import { useUIStore } from "../../stores/useUIStore";
import type { ClipData, SoundData, TrackData } from "../../stores/types";
import { addSoundAt, removeSound, seek, setTrackInstrument, stop } from "../sync";

const MIDI_C4 = 60 as MidiNote;

const makeTrack = (overrides: Partial<TrackData> = {}): TrackData => ({
  id: "t1",
  name: "Track 1",
  volume: 1,
  muted: false,
  soloed: false,
  instrumentId: "drum-kit-alpha",
  ...overrides,
});

const makeClip = (overrides: Partial<ClipData> = {}): ClipData => ({
  id: "c1",
  trackId: "t1",
  startTime: 4,
  duration: 5,
  offset: 0,
  sounds: [],
  ...overrides,
});

const makeSound = (overrides: Partial<SoundData> = {}): SoundData => ({
  id: "s1",
  clipId: "c1",
  startTime: 0,
  duration: 0.5,
  offset: 0,
  midiNote: MIDI_C4,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  useProjectStore.setState({ tracks: [], clips: [] });
  useUIStore.setState({ editingClipId: null });
  useTransportStore.setState({ isPlaying: true, playbackPosition: 99 });
});

describe("stop", () => {
  it("stops the engine, clears isPlaying and returns to 0 with no clip being edited", () => {
    stop();

    expect(engine.stop).toHaveBeenCalledTimes(1);
    expect(useTransportStore.getState().isPlaying).toBe(false);
    expect(useTransportStore.getState().playbackPosition).toBe(0);
    expect(engine.transport.seek).toHaveBeenLastCalledWith(0);
  });

  it("returns to the start of the clip being edited", () => {
    useProjectStore.setState({ clips: [makeClip({ id: "c1", startTime: 4 })] });
    useUIStore.setState({ editingClipId: "c1" });

    stop();

    expect(useTransportStore.getState().isPlaying).toBe(false);
    expect(useTransportStore.getState().playbackPosition).toBe(4);
    expect(engine.transport.seek).toHaveBeenLastCalledWith(4);
  });

  it("falls back to 0 instead of throwing when the editing clip no longer exists", () => {
    useProjectStore.setState({ clips: [makeClip({ id: "c1", startTime: 4 })] });
    useUIStore.setState({ editingClipId: "deleted-clip" });

    expect(() => stop()).not.toThrow();
    expect(useTransportStore.getState().playbackPosition).toBe(0);
    expect(engine.transport.seek).toHaveBeenLastCalledWith(0);
  });
});

describe("seek", () => {
  it("moves the engine transport and records the position", () => {
    seek(12);

    expect(engine.transport.seek).toHaveBeenCalledWith(12);
    expect(useTransportStore.getState().playbackPosition).toBe(12);
  });
});

describe("setTrackInstrument", () => {
  it("applies the instrument to the engine track and then updates the store", () => {
    const engineTrack = { setInstrument: vi.fn() };
    vi.mocked(engine.getTrack).mockReturnValue(engineTrack as never);
    useProjectStore.setState({ tracks: [makeTrack({ instrumentId: "drum-kit-alpha" })] });

    setTrackInstrument("t1", "synth-gamma");

    expect(engineTrack.setInstrument).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "synth" })
    );
    expect(useProjectStore.getState().tracks[0].instrumentId).toBe("synth-gamma");
  });

  it("leaves the store untouched when the instrument is unknown", () => {
    const engineTrack = { setInstrument: vi.fn() };
    vi.mocked(engine.getTrack).mockReturnValue(engineTrack as never);
    useProjectStore.setState({ tracks: [makeTrack({ instrumentId: "drum-kit-alpha" })] });

    setTrackInstrument("t1", "does-not-exist");

    expect(engineTrack.setInstrument).not.toHaveBeenCalled();
    expect(useProjectStore.getState().tracks[0].instrumentId).toBe("drum-kit-alpha");
  });

  it("leaves the store untouched when the engine has no such track", () => {
    vi.mocked(engine.getTrack).mockReturnValue(undefined);
    useProjectStore.setState({ tracks: [makeTrack({ instrumentId: "drum-kit-alpha" })] });

    setTrackInstrument("t1", "synth-gamma");

    expect(useProjectStore.getState().tracks[0].instrumentId).toBe("drum-kit-alpha");
  });
});

describe("addSoundAt", () => {
  it("adds a sound without mutating the previous clip or its sounds array", () => {
    useProjectStore.setState({ clips: [makeClip()] });
    const clipBefore = useProjectStore.getState().clips[0];
    const soundsBefore = clipBefore.sounds;

    addSoundAt("c1", MIDI_C4, 1);

    const clipAfter = useProjectStore.getState().clips[0];
    expect(clipAfter).not.toBe(clipBefore);
    expect(clipAfter.sounds).not.toBe(soundsBefore);
    expect(soundsBefore).toHaveLength(0);
    expect(clipAfter.sounds).toHaveLength(1);
    expect(clipAfter.sounds[0]).toMatchObject({
      clipId: "c1",
      midiNote: MIDI_C4,
      startTime: 1,
      duration: 0.5,
      offset: 0,
    });
  });

  it("pushes the updated clips to the engine", () => {
    useProjectStore.setState({ clips: [makeClip()] });

    addSoundAt("c1", MIDI_C4, 1);

    expect(engine.setClips).toHaveBeenCalledTimes(1);
    expect(vi.mocked(engine.setClips).mock.calls[0][0]).toHaveLength(1);
  });

  it("clamps a negative start time to 0", () => {
    useProjectStore.setState({ clips: [makeClip()] });

    addSoundAt("c1", MIDI_C4, -3);

    expect(useProjectStore.getState().clips[0].sounds[0].startTime).toBe(0);
  });

  it("only changes the targeted clip", () => {
    const other = makeClip({ id: "c2" });
    useProjectStore.setState({ clips: [makeClip({ id: "c1" }), other] });

    addSoundAt("c1", MIDI_C4, 1);

    expect(useProjectStore.getState().clips[1]).toBe(other);
  });
});

describe("removeSound", () => {
  it("removes only the targeted sound without mutating the previous sounds array", () => {
    const kept = makeSound({ id: "keep" });
    const removed = makeSound({ id: "drop" });
    useProjectStore.setState({ clips: [makeClip({ sounds: [kept, removed] })] });
    const soundsBefore = useProjectStore.getState().clips[0].sounds;

    removeSound("c1", "drop");

    const soundsAfter = useProjectStore.getState().clips[0].sounds;
    expect(soundsAfter).not.toBe(soundsBefore);
    expect(soundsAfter).toEqual([kept]);
    expect(soundsBefore).toHaveLength(2);
    expect(engine.setClips).toHaveBeenCalledTimes(1);
  });

  it("does nothing harmful when the sound id does not exist", () => {
    const sound = makeSound({ id: "only" });
    useProjectStore.setState({ clips: [makeClip({ sounds: [sound] })] });

    expect(() => removeSound("c1", "missing")).not.toThrow();
    expect(useProjectStore.getState().clips[0].sounds).toEqual([sound]);
  });
});
