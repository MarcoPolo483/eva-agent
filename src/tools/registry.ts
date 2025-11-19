import type { Tool, ToolInvoker, Json, AgentContext } from "../types.js";
import { TokenBudget } from "../budget/tokenBudget.js";

export class ToolRegistry implements ToolInvoker {
  private tools = new Map<string, Tool>();
  private budget?: TokenBudget;

  constructor(limit?: number) {
    if (limit && limit > 0) this.budget = new TokenBudget(limit);
  }

  register(tool: Tool) {
    this.tools.set(tool.name, tool);
    return this;
  }

  has(name: string) {
    return this.tools.has(name);
  }

  async call(name: string, input?: Json, ctxOverride?: Partial<AgentContext>) {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Tool not found: ${name}`);

    const tokens = Math.max(0, tool.estimateTokens?.(input) ?? 0);
    if (this.budget) this.budget.spend(tokens);

    const ctx: AgentContext = {
      memory: (ctxOverride as any)?.memory!,
      tools: this,
      signal: ctxOverride?.signal,
    };

    return tool.invoke(input, ctx);
  }
}
