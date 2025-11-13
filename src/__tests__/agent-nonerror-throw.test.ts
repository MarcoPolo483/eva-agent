import { describe, it, expect } from "vitest";
import { Agent } from "../runtime/agent.js";
import { InMemoryMemory } from "../memory/in-memory.js";
import { ToolRegistry } from "../tools/registry.js";

describe("Agent catch path for non-Error throws", () => {
  it("wraps non-Error thrown by a tool into Error and returns ok:false", async () => {
    const memory = new InMemoryMemory();
    const tools = new ToolRegistry(100).register({
      name: "boom",
      // no estimateTokens -> defaults to 0
      invoke: async () => {
        // Throw a non-Error value to exercise catch wrapping
        // eslint-disable-next-line no-throw-literal
        throw "boom";
      }
    });

    const agent = new Agent({ memory, tools });
    const res = await agent.run({ 
      goal: "boom",
      planner: async () => ({ steps: [{ tool: "boom", input: {} }] })
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).toBeInstanceOf(Error);
      expect(String(res.error.message).toLowerCase()).toContain("boom");
    }
  });
});