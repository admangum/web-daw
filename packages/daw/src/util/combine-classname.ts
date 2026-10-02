export function cx(...args: (string | undefined)[]) {
  const all = args.reduce(
    (acc, item) => (typeof item === "string" ? `${acc} ${item}` : acc),
    ""
  ) as string;
  const tokens = all.trim().split(/\s+/);
  const unique = [...new Set(tokens)];
  return unique.join(" ");
}
