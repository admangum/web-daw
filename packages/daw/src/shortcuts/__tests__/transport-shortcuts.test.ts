import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../engine/sync", () => ({ play: vi.fn(), pause: vi.fn(), stop: vi.fn() }));

import * as Sync from "../../engine/sync";
import { useTransportStore } from "../../stores/useTransportStore";
import { transportShortcuts } from "../transport-shortcuts";

const get = (id: string) => transportShortcuts.find((s) => s.id === id)!;

describe("transport shortcuts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("Space plays when not playing", () => {
    useTransportStore.setState({ isPlaying: false });
    get("transport.toggle-play").run();
    expect(Sync.play).toHaveBeenCalled();
    expect(Sync.stop).not.toHaveBeenCalled();
  });

  it("Space stops when playing", () => {
    useTransportStore.setState({ isPlaying: true });
    get("transport.toggle-play").run();
    expect(Sync.stop).toHaveBeenCalled();
  });

  it("Shift+Space is only active while playing and pauses", () => {
    const pause = get("transport.pause");
    useTransportStore.setState({ isPlaying: false });
    expect(pause.when!()).toBe(false);
    useTransportStore.setState({ isPlaying: true });
    expect(pause.when!()).toBe(true);
    pause.run();
    expect(Sync.pause).toHaveBeenCalled();
  });
});
