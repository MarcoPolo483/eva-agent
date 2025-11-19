import { describe, it, expect } from "vitest";

import { BaseMemory } from "../memory/memory.js";

// Minimal BaseMemory implementation for testing default keys() behavior
class TestMemory extends BaseMemory {
  private store = new Map<string, any>();
  async put(key: string, value: any) {
    this.store.set(key, value);
  }
  async get(key: string) {
    return this.store.get(key);
  }
}

describe("BaseMemory keys method", () => {
  it("should return empty array for keys method", async () => {
    const memory = new TestMemory();

    // Put some values
    await memory.put("key1", "value1");
    await memory.put("key2", { data: "value2" });

    // keys() should return empty array (default implementation)
    const keys = await memory.keys!();

    expect(Array.isArray(keys)).toBe(true);
    expect(keys).toEqual([]);
  });
});
