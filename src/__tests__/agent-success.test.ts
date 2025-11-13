import { describe, it, expect } from "vitest";

import { Agent } from "../runtime/agent.js";
import { InMemoryMemory } from "../memory/in-memory.js";
import { ToolRegistry } from "../tools/registry.js";

describe("Agent success", () => {
  it("runs a single tool and appends to history", async () => {
    const memory = new InMemoryMemory();
    const tools = new ToolRegistry(100).register({
      name: "echo",
      estimateTokens: () => 5,
      invoke: async (i) => ({ ok: true, value: i as any })
    });
    const agent = new Agent({ memory, tools });
    const res = await agent.run({ goal: "echo", input: { text: "hi" } });
    expect(res.ok).toBe(true);
    const hist = await memory.get("history");
    expect(Array.isArray(hist)).toBe(true);
  });
});