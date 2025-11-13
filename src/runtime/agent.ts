import type { AgentGoal, AgentContext, PlannerFn, ToolResult } from "../types.js";
import type { ToolRegistry } from "../tools/registry.js";

export type AgentOptions = {
  memory: AgentContext["memory"];
  tools: ToolRegistry;
  tokenLimit?: number; // reserved for future
};

export class Agent {
  constructor(private readonly opts: AgentOptions) {}

  async run(goal: AgentGoal): Promise<{ ok: true; steps: ToolResult[] } | { ok: false; error: Error }> {
    const ctx: AgentContext = {
      memory: this.opts.memory,
      tools: this.opts.tools
    };
    const planner: PlannerFn = goal.planner ?? (async (g, c) => {
      const { simplePlanner } = await import("../planner/planner.js");
      return simplePlanner(g, c);
    });

    try {
      const plan = await planner(goal, ctx);
      const results: ToolResult[] = [];
      for (const step of plan.steps) {
        const res = await this.opts.tools.call(step.tool, step.input, ctx);
        results.push(res);
        if (!res.ok) return { ok: false, error: res.error };
        // persist step result if desired
        await this.opts.memory.append?.("history", { tool: step.tool, result: res.value });
      }
      return { ok: true, steps: results };
    } catch (e: any) {
      return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  }
}