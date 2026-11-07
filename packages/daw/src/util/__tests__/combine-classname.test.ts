import { describe, expect, it } from "vitest";
import { cx } from "../combine-classname";

describe("cx", () => {
  it("joins class names with a single space", () => {
    expect(cx("a", "b")).toBe("a b");
  });

  it("ignores undefined values", () => {
    expect(cx("a", undefined, "b")).toBe("a b");
  });

  it("removes duplicate tokens", () => {
    expect(cx("a b", "b c")).toBe("a b c");
  });

  it("collapses extra whitespace", () => {
    expect(cx("  a   b ", "c")).toBe("a b c");
  });

  it("returns an empty string with no usable input", () => {
    expect(cx()).toBe("");
    expect(cx(undefined)).toBe("");
  });
});
