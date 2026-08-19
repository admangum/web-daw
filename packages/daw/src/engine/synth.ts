/** Generates a short decaying tone, used as placeholder clip material until file import lands. */
export function createDemoClipBuffer(context: BaseAudioContext, duration = 0.5): AudioBuffer {
  const sampleRate = context.sampleRate;
  const length = Math.floor(sampleRate * duration);
  const buffer = context.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  const frequency = 440;

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-4 * t);
    data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
  }

  return buffer;
}
