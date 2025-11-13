import { describe, it, expect } from "vitest";
import { ToolRegistry } from "../tools/registry.js";
import { InMemoryMemory } from "../memory/in-memory.js";

describe("ToolRegistry passes ctx (memory, tools, signal) to tool", () => {
  it("tool can use ctx.memory and ctx.tools", async () => {
    const mem = new InMemoryMemory();
    const reg = new ToolRegistry(100);
    reg.register({
      name: "self",
      estimateTokens: () => 0,
      invoke: async (_i, ctx) => {
        await ctx.memory.put("seen", true);
        return { ok: true, value: { hasSelf: ctx.tools.has("self") } };
      }
    });

    const ac = new AbortController();
    const res = await reg.call("self", undefined, { memory: mem, signal: ac.signal } as any);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value).toMatchObject({ hasSelf: true });
    }
    expect(await mem.get("seen")).toBe(true);
  });
});