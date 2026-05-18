import { cn } from "../utils";

describe("cn", () => {
  it("returns an empty string when given no inputs", () => {
    expect(cn()).toBe("");
  });

  it("joins string class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignores falsy values", () => {
    expect(cn("foo", null, undefined, false, "bar")).toBe("foo bar");
  });

  it("supports conditional objects from clsx", () => {
    expect(cn("foo", { bar: true, baz: false })).toBe("foo bar");
  });

  it("merges conflicting tailwind utilities with twMerge", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("preserves non-conflicting tailwind utilities", () => {
    expect(cn("p-2", "m-4", "text-red-500")).toBe("p-2 m-4 text-red-500");
  });

  it("flattens nested array inputs", () => {
    expect(cn(["foo", ["bar", "baz"]])).toBe("foo bar baz");
  });
});
