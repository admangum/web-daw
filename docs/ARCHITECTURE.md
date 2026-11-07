# Web DAW Architecture

## Context

A web-based digital audio workstation (DAW) built as a Turborepo monorepo with two packages:

- **`audio-engine`** — a dual-purpose, framework-agnostic WebAudio abstraction library (publishable eventually)
- **`daw`** — the DAW application, built with React + Vite + Tailwind, powered by `audio-engine`

Initial scope: timeline/arrangement view. Audio model: linear track chain (Source → Effects → Output). State: Zustand. Persistence: IndexedDB/LocalStorage (not yet implemented).

---

## Repo Structure

```
web-daw/
├── packages/
│   ├── audio-engine/        # WebAudio abstraction library (no framework deps)
│   │   ├── src/
│   │   │   ├── engine/      # AudioEngine, AudioContext lifecycle
│   │   │   ├── track/       # Track, Mixer, EffectsChain, sources/, effects/
│   │   │   ├── transport/   # Transport (play/pause/seek/tempo)
│   │   │   ├── timeline/    # Clip, Scheduler
│   │   │   ├── __tests__/   # Vitest unit tests + hand-rolled AudioContext fakes
│   │   │   └── index.ts     # Public API surface
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts   # lib mode build
│   │
│   └── daw/                 # React DAW application
│       ├── src/
│       │   ├── components/  # TransportBar, TrackHeader, TrackLane, Timeline, Playhead
│       │   ├── engine/      # engine singleton, sync.ts adapter, bufferCache, synth
│       │   ├── stores/      # Zustand stores (useProjectStore, useTransportStore, useUIStore)
│       │   ├── ui/          # Low level UI building blocks
│       │   │   └── icons/   # svg/ is the source; components/ and index.ts are generated (scripts/icons, runs in vite dev or `pnpm --filter daw icons`)
│       │   └── main.tsx
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Package: `audio-engine`

**No React / framework dependencies.** Pure TypeScript. Built in Vite lib mode to `dist/`.

### Core abstractions (linear chain per track)

```
AudioEngine
  └── Transport          ← global playback clock
  └── Mixer               ← master bus, cross-track solo/mute resolution
  └── Track[]
        └── EffectsChain ← ordered AudioEffect[] (Gain, Pan, Filter, …)
  └── Scheduler           ← look-ahead clip scheduling
```

Per-clip playback nodes (`BufferSource`) are created on demand by the `Scheduler` and connected into `track.input` — a `Track` does not hold a persistent source node, since WebAudio source nodes are single-use.

### Key classes

| Class          | Responsibility                                                                              |
| -------------- | ------------------------------------------------------------------------------------------- |
| `AudioEngine`  | Creates/resumes `AudioContext`, owns transport, mixer, tracks, scheduler                    |
| `Transport`    | Play, pause, stop, seek, BPM, loop region; position derived from `AudioContext.currentTime` |
| `Track`        | Effects chain + volume/mute gain stages; exposes `input`/`output`                           |
| `Mixer`        | Owns cross-track solo/mute resolution and the master bus                                    |
| `EffectsChain` | Ordered `AudioEffect[]`; rewires on insert/remove with click-safe gain ramping              |
| `AudioEffect`  | Abstract one-input/one-output wrapper; concrete: `GainEffect`, `PanEffect`, `FilterEffect`  |
| `AudioSource`  | Abstract factory for single-use source nodes; concrete: `BufferSource`, `OscillatorSource`  |
| `Clip`         | Audio region: `{ trackId, startTime, duration, offset, buffer }`                            |
| `Scheduler`    | Look-ahead scheduling loop; fires clips onto tracks at the right time                       |

### Scheduling strategy (critical path)

Naive scheduling (`setInterval` calling `source.start()` in real time) drifts and causes audible jitter, and is throttled when the tab backgrounds. `Scheduler` uses the standard look-ahead pattern instead:

- A `setInterval` timer fires every 25ms
- On each tick, it looks ahead 100ms and schedules any clip whose `startTime` falls in that window, via `source.start(when)` using `AudioContext.currentTime` (never wall-clock time)
- `Transport.getPosition()` derives position from `AudioContext.currentTime` on every call — position is never accumulated in JS, which is what keeps playback sample-accurate regardless of timer jitter

### AudioContext lifecycle

Browsers block `AudioContext` until a user gesture. `AudioEngine.play()` calls `resume()` internally before starting the transport; `daw`'s `TransportBar` reads `engine.state` to show "Audio suspended — press Play to start" until then.

### Effects chain rewiring

`EffectsChain.insert()`/`.remove()` ramp the chain's own output gain to 0 over 5ms, perform the rewire, then ramp back to 1 — avoiding the audible click that comes from disconnecting/reconnecting live nodes at full signal level.

### Mixer / solo-mute ownership

Solo/mute is cross-track (soloing one track must mute all others), so `Track` doesn't know about other tracks. `Mixer` tracks muted/soloed sets and drives each `Track.muteGain` via `setTargetAtTime` whenever the set changes.

### Public API (`src/index.ts`)

```ts
export { AudioEngine, type EngineOptions } from "./engine/AudioEngine";
export { Transport, type TransportState, type LoopRegion } from "./transport/Transport";
export { Track, type TrackOptions } from "./track/Track";
export { Mixer } from "./track/Mixer";
export { EffectsChain } from "./track/EffectsChain";
export {
  BufferSource,
  OscillatorSource,
  type OscillatorSourceOptions,
  type PlayOptions,
} from "./track/sources";
export { AudioSource } from "./track/sources/AudioSource";
export { AudioEffect, GainEffect, PanEffect, FilterEffect } from "./track/effects";
export { Clip, type ClipOptions } from "./timeline/Clip";
export { Scheduler } from "./timeline/Scheduler";
```

### Testing strategy

`AudioContext` doesn't exist in Node/Vitest. Rather than depend on a third-party mock package, `src/__tests__/fakeAudioContext.ts` hand-rolls minimal stand-ins (`FakeAudioContext`, `FakeGainNode`, `FakeBufferSourceNode`, …) with just enough surface area to unit-test graph wiring and time math:

- `Transport` — position derivation, pause/resume, seek, loop wrap
- `Clip` — `endTime`, `overlaps`
- `EffectsChain` — wiring order on insert/remove, gain restored after rewire
- `Mixer` — solo/mute resolution across tracks

Actual node wiring and audible output are verified manually in a browser rather than in Vitest.

---

## Package: `daw`

Depends on `audio-engine` via `"audio-engine": "workspace:*"`.

### Zustand stores

| Store               | State                                                                      |
| ------------------- | -------------------------------------------------------------------------- |
| `useProjectStore`   | `tracks: TrackData[]`, `clips: ClipData[]`, project name/bpm               |
| `useTransportStore` | `isPlaying`, `bpm`, `loop`, `playbackPosition` (snapshot only — see below) |
| `useUIStore`        | `selectedTrackId`, `pixelsPerSecond`                                       |

Stores hold **plain serializable data only** — no `AudioNode`/`AudioBuffer`. `ClipData.bufferId` is a key into an engine-side `Map<string, AudioBuffer>` cache (`engine/bufferCache.ts`), not the buffer itself.

### Store/engine sync layer (`src/engine/sync.ts`)

The **only** module allowed to translate between store state and the live `audio-engine` graph. Every mutation (`addTrack`, `setTrackVolume`, `setTrackMuted`, `addClipAt`, `play`, …) updates both the Zustand store and the engine in the same call. Components and other stores never import `engine` directly for mutations — only `sync.ts` does.

### Playhead rendering

`Playhead.tsx` does **not** read position through Zustand on every frame — that would re-render every store subscriber many times a second. It reads `engine.transport.getPosition()` directly inside a `requestAnimationFrame` loop scoped to just that component, and moves the DOM node via `style.transform`. `useTransportStore.playbackPosition` is only written on pause/stop/seek, as a non-realtime snapshot.

### Component tree (initial scope)

```
<App>
  <TransportBar />              ← play/pause/stop, + Add Track, suspended-audio indicator
  <div className="flex">
    <TimeRulerSpacer /> + <TrackHeader />*   ← name, mute, solo, volume
    <Timeline>
      <TrackLane />*             ← click to place a clip; click a clip to remove it
      <Playhead />               ← rAF-driven, reads AudioContext.currentTime directly
    </Timeline>
  </div>
</App>
```

Clip material is currently a synthesized placeholder tone (`engine/synth.ts`) generated on click — file import isn't implemented yet.

### Persistence

Not yet implemented. Planned: `idb` (already a dependency) to save/load project JSON, with audio buffers stored as `ArrayBuffer` blobs. Target schema:

```ts
type Project = {
  id: string;
  name: string;
  bpm: number;
  tracks: TrackData[];
  clips: ClipData[];
};
```

**Deferred decisions worth flagging when this is built:**

- _Musical time_: `Clip.startTime` is absolute seconds. Tempo-synced grid snapping would need a bars/beats representation too — revisit if/when BPM changes mid-project become a requirement.
- _Undo/redo_: not in scope, but `useProjectStore` is kept flat/normalized so a temporal middleware (e.g. `zundo`) can be added later without a rewrite.

---

## Turborepo config

```json
// turbo.json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "format": {},
    "format:check": {},
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["^build"] }
  }
}
```

`daw#build` waits for `audio-engine#build` because of `"^build"`. `dev` intentionally has no `dependsOn` — `audio-engine`'s `dev` script (`vite build --watch`) and `daw`'s `dev` script run concurrently under `turbo dev`, so local dev isn't gated on a full library build each change.

Root `package.json` requires a `packageManager` field (`pnpm@11.17.0`) — Turborepo 2.x refuses to resolve the workspace without it.

Formatting is handled by Prettier (`format`/`format:check` scripts, root `.prettierrc.json`); linting by `oxlint`, kept separate from formatting concerns.

---

## Iteration strategy

1. Develop `audio-engine` API in `packages/audio-engine/src/` with unit tests (Vitest)
2. Run `turbo dev` to watch both packages simultaneously
3. `daw` imports `audio-engine` as a built package via the pnpm workspace symlink — clean boundary enforced by the build
4. When the library API stabilizes, it can be extracted to its own repo with no changes needed

---

## Verification

- `pnpm turbo build` — both packages build cleanly, no type errors
- `pnpm turbo lint typecheck test` — clean across the workspace
- `pnpm turbo dev` — `audio-engine` watch-rebuilds; `daw` hot-reloads
- Manual (verified in a real browser via Chrome DevTools MCP): open `daw`, click **+ Add Track**, click a lane to place a clip, press **Play** — audio plays at the correct position, playhead moves smoothly, no console errors
- Known-fixed bug: `TrackLane`'s Zustand selector (`s.clips.filter(...)`) returned a new array reference every render, causing an infinite re-render loop ("Maximum update depth exceeded"). Fixed with `useShallow` from `zustand/react/shallow`.
