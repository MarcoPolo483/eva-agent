import { describe, it, expect } from "vitest";

import { Agent } from "../runtime/agent.js";
import { InMemoryMemory } from "../memory/in-memory.js";
import { ToolRegistry } from "../tools/registry.js";

describe("Budget exceed", () => {
  it("fails when token budget is exceeded", async () => {
    const memory = new InMemoryMemory();
    const tools = new ToolRegistry(5).register({
      name: "expensive",
      estimateTokens: () => 10,
      invoke: async () => ({ ok: true, value: {} })
    });
    const agent = new Agent({ memory, tools });
    // Use custom planner to call "expensive" tool
    const res = await agent.run({ 
      goal: "expensive",
      planner: async () => ({ steps: [{ tool: "expensive", input: {} }] })
    });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.message).toMatch(/Budget exceeded/);
  });
});