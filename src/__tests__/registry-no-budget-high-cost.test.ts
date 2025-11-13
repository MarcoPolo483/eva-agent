import { describe, it, expect } from "vitest";
import { ToolRegistry } from "../tools/registry.js";
import { InMemoryMemory } from "../memory/in-memory.js";

describe("ToolRegistry without budget permits high token estimate", () => {
  it("succeeds when no budget is configured even with high estimateTokens", async () => {
    const reg = new ToolRegistry(); // no limit => no TokenBudget
    reg.register({
      name: "high-cost",
      estimateTokens: () => 1000,
      invoke: async (i) => ({ ok: true, value: i ?? null })
    });

    const res = await reg.call("high-cost", { x: 1 }, { memory: new InMemoryMemory() } as any);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.value).toEqual({ x: 1 });
  });
});