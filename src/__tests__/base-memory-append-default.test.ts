import { describe, it, expect } from "vitest";
import { BaseMemory } from "../memory/memory.js";
import type { Json } from "../types.js";

class TestMemory extends BaseMemory {
  private store = new Map<string, Json>();
  async put(key: string, value: Json) { this.store.set(key, value); }
  async get(key: string) { return this.store.get(key); }
  async keys() { return Array.from(this.store.keys()); }
  // Note: no append override -> uses BaseMemory.append path
}

describe("BaseMemory.append default implementation", () => {
  it("initializes new array when key is undefined", async () => {
    const m = new TestMemory();
    await m.append("history", { a: 1 });
    await m.append("history", { b: 2 });
    const v = await m.get("history");
    expect(Array.isArray(v)).toBe(true);
    expect(v).toEqual([{ a: 1 }, { b: 2 }]);
  });

  it("throws when existing value at key is not an array", async () => {
    const m = new TestMemory();
    await m.put("history", { not: "array" });
    await expect(m.append("history", { c: 3 })).rejects.toThrow(/not an array/i);
  });
});