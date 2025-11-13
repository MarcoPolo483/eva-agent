import { describe, it, expect } from "vitest";

import { ToolRegistry } from "../tools/registry.js";
import { InMemoryMemory } from "../memory/in-memory.js";

describe("ToolRegistry", () => {
  it("registers and calls a tool", async () => {
    const reg = new ToolRegistry(100);
    reg.register({
      name: "add",
      estimateTokens: () => 1,
      invoke: async (i) => {
        const { a, b } = (i as any) ?? {};
        return { ok: true, value: { sum: (a ?? 0) + (b ?? 0) } };
      }
    });
    const res = await reg.call("add", { a: 2, b: 3 }, { memory: new InMemoryMemory() } as any);
    expect(res.ok).toBe(true);
    if (res.ok) expect((res.value as any).sum).toBe(5);
  });

  it("throws on unknown tool", async () => {
    const reg = new ToolRegistry();
    await expect(reg.call("missing", {} as any, { memory: new InMemoryMemory() } as any)).rejects.toThrow(/not found/i);
  });
});