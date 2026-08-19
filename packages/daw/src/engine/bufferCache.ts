const cache = new Map<string, AudioBuffer>();

export function registerBuffer(id: string, buffer: AudioBuffer): void {
  cache.set(id, buffer);
}

export function getBuffer(id: string): AudioBuffer | undefined {
  return cache.get(id);
}
