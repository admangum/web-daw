export function cx(...args: (string | undefined)[]) {
  const all = args.filter((arg) => typeof arg === "string").join(" ");
  const tokens = all.trim().split(/\s+/);
  const uniqueTokens = [...new Set(tokens)];
  return uniqueTokens.join(" ");
}
