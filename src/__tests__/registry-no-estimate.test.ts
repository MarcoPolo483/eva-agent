import { describe, it, expect } from "vitest";

import { ToolRegistry } from "../tools/registry.js";
import { InMemoryMemory } from "../memory/in-memory.js";

describe("ToolRegistry with no estimateTokens", () => {
  it("invokes tool successfully and does not consume budget (0 tokens)", async () => {
    const reg = new ToolRegistry(1); // very small limit to detect accidental spend
    reg.register({
      name: "no-estimate",
      // no estimateTokens present
      invoke: async (i) => ({ ok: true, value: i ?? null }),
    });

    const res = await reg.call("no-estimate", { a: 1 }, { memory: new InMemoryMemory() } as any);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value).toEqual({ a: 1 });
    }
  });

  it("has() correctly reports presence/absence of tools", () => {
    const reg = new ToolRegistry();
    reg.register({ name: "t1", invoke: async () => ({ ok: true, value: null }) });
    expect(reg.has("t1")).toBe(true);
    expect(reg.has("missing")).toBe(false);
  });
});
