import { describe, it, expect } from "vitest";
import { Agent } from "../runtime/agent.js";
import { InMemoryMemory } from "../memory/in-memory.js";
import { ToolRegistry } from "../tools/registry.js";

describe("Agent handles memory.append failure during history write", () => {
  it("returns ok:false when append throws (history not an array)", async () => {
    const memory = new InMemoryMemory();
    // Pre-set a non-array value at 'history' to trigger append error in Agent.run
    await memory.put("history", { not: "array" });

    const tools = new ToolRegistry(100).register({
      name: "ok",
      estimateTokens: () => 1,
      invoke: async (i) => ({ ok: true, value: i ?? {} })
    });

    const agent = new Agent({ memory, tools });
    const res = await agent.run({ 
      goal: "two-steps", 
      input: { text: "hi" },
      planner: async () => ({ steps: [{ tool: "ok", input: {} }] })
    });

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(String(res.error.message).toLowerCase()).toContain("not an array");
    }
  });
});