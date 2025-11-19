import { describe, it, expect } from "vitest";

import { Agent } from "../runtime/agent.js";
import { ToolRegistry } from "../tools/registry.js";
import type { Memory, Json } from "../types.js";

// Memory implementation without append() to exercise the optional chaining path in Agent.run
class MemoryNoAppend implements Memory {
  private map = new Map<string, Json>();
  async put(key: string, value: Json) {
    this.map.set(key, value);
  }
  async get(key: string) {
    return this.map.get(key);
  }
  // no append() method on purpose
}

describe("Agent with memory lacking append()", () => {
  it("runs successfully and skips history append", async () => {
    const memory = new MemoryNoAppend();
    const tools = new ToolRegistry(100).register({
      name: "ok",
      estimateTokens: () => 1,
      invoke: async (i) => ({ ok: true, value: i ?? {} }),
    });

    const agent = new Agent({ memory, tools });
    const res = await agent.run({
      goal: "ok",
      input: { a: 1 },
      planner: async () => ({ steps: [{ tool: "ok", input: { a: 1 } }] }),
    });
    expect(res.ok).toBe(true);
  });
});
