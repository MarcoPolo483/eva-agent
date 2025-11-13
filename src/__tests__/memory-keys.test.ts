import { describe, it, expect } from "vitest";
import { InMemoryMemory } from "../memory/in-memory.js";

describe("InMemoryMemory keys()", () => {
  it("lists keys after put operations", async () => {
    const m = new InMemoryMemory();
    await m.put("k1", 1);
    await m.put("k2", { a: 2 });
    const keys = await m.keys?.();
    expect(Array.isArray(keys)).toBe(true);
    expect(keys).toEqual(expect.arrayContaining(["k1", "k2"]));
  });
});