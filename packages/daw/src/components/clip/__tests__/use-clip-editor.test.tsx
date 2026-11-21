import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../engine/sync", () => ({
  getTransportPosition: vi.fn(() => 0),
  seek: vi.fn(),
}));

import * as Sync from "../../../engine/sync";
import type { ClipData } from "../../../stores/types";
import { useTransportStore } from "../../../stores/useTransportStore";
import { useUIStore } from "../../../stores/useUIStore";
import { useClipEditor } from "../use-clip-editor";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const originalSetSelectedTrackId = useUIStore.getState().setSelectedTrackId;

const makeClip = (overrides: Partial<ClipData> = {}): ClipData => ({
  id: "c1",
  trackId: "t2",
  startTime: 4,
  duration: 5,
  offset: 0,
  sounds: [],
  ...overrides,
});

let result: ReturnType<typeof useClipEditor>;

function Harness({ clip }: { clip: ClipData }) {
  result = useClipEditor(clip);
  return null;
}

let container: HTMLDivElement;
let root: Root | null;

function render(clip: ClipData) {
  act(() => {
    root!.render(<Harness clip={clip} />);
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(Sync.getTransportPosition).mockReturnValue(0);
  useUIStore.setState({
    selectedTrackId: null,
    editingClipId: null,
    setSelectedTrackId: originalSetSelectedTrackId,
  });
  useTransportStore.setState({ isPlaying: false });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  root = null;
  container.remove();
});

describe("useClipEditor", () => {
  describe("isEditing", () => {
    it("is true only while this clip's id is the editing clip", () => {
      render(makeClip({ id: "c1" }));
      expect(result.isEditing).toBe(false);

      act(() => useUIStore.setState({ editingClipId: "c1" }));
      expect(result.isEditing).toBe(true);

      act(() => useUIStore.setState({ editingClipId: "other-clip" }));
      expect(result.isEditing).toBe(false);
    });
  });

  describe("open", () => {
    it("selects the clip's track, marks the clip as editing and seeks to its start", () => {
      useUIStore.setState({ selectedTrackId: "t1" });
      render(makeClip({ id: "c1", trackId: "t2", startTime: 4 }));

      act(() => result.open());

      expect(useUIStore.getState().selectedTrackId).toBe("t2");
      expect(useUIStore.getState().editingClipId).toBe("c1");
      expect(Sync.seek).toHaveBeenCalledWith(4);
      expect(result.isEditing).toBe(true);
    });

    it("does not re-select the track when it is already selected", () => {
      const setSelectedTrackId = vi.fn();
      useUIStore.setState({ selectedTrackId: "t2", setSelectedTrackId });
      render(makeClip({ trackId: "t2" }));

      act(() => result.open());

      expect(setSelectedTrackId).not.toHaveBeenCalled();
    });
  });

  describe("close", () => {
    it("clears the editing clip and seeks back to where the transport was at open", () => {
      vi.mocked(Sync.getTransportPosition).mockReturnValue(7);
      render(makeClip({ startTime: 4 }));
      act(() => result.open());
      vi.mocked(Sync.seek).mockClear();

      act(() => result.close());

      expect(useUIStore.getState().editingClipId).toBeNull();
      expect(Sync.seek).toHaveBeenCalledTimes(1);
      expect(Sync.seek).toHaveBeenCalledWith(7);
      expect(result.isEditing).toBe(false);
    });

    it("clears the editing clip without seeking while playing", () => {
      vi.mocked(Sync.getTransportPosition).mockReturnValue(7);
      render(makeClip({ startTime: 4 }));
      act(() => result.open());
      vi.mocked(Sync.seek).mockClear();
      useTransportStore.setState({ isPlaying: true });

      act(() => result.close());

      expect(useUIStore.getState().editingClipId).toBeNull();
      expect(Sync.seek).not.toHaveBeenCalled();
    });

    it("restores the position recorded by the most recent open", () => {
      render(makeClip({ startTime: 4 }));

      vi.mocked(Sync.getTransportPosition).mockReturnValue(2);
      act(() => result.open());
      act(() => result.close());

      vi.mocked(Sync.getTransportPosition).mockReturnValue(9);
      act(() => result.open());
      vi.mocked(Sync.seek).mockClear();
      act(() => result.close());

      expect(Sync.seek).toHaveBeenCalledWith(9);
    });
  });
});
