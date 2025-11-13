import { describe, it, expect } from "vitest";

import { InMemoryMemory } from "../memory/in-memory.js";

describe("InMemoryMemory", () => {
  it("put/get/append", async () => {
    const m = new InMemoryMemory();
    await m.put("k", "v");
    expect(await m.get("k")).toBe("v");
    await m.append("hist", { a: 1 });
    await m.append("hist", { b: 2 });
    const hist = await m.get("hist");
    expect(Array.isArray(hist)).toBe(true);
    expect((hist as any[]).length).toBe(2);
  });
});