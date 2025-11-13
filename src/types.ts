export type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

export type AgentGoal = {
  goal: string;
  input?: Json;
  planner?: PlannerFn;
};

export type PlannerOutput = {
  steps: Array<{ tool: string; input?: Json }>;
};

export type ToolResult = { ok: true; value: Json } | { ok: false; error: Error };

export type Tool = {
  name: string;
  estimateTokens?: (input?: Json) => number;
  invoke: (input: Json | undefined, ctx: AgentContext) => Promise<ToolResult>;
};

export type AgentContext = {
  memory: Memory;
  tools: ToolInvoker;
  signal?: AbortSignal;
};

export type Memory = {
  put: (key: string, value: Json) => Promise<void>;
  get: (key: string) => Promise<Json | undefined>;
  append?: (key: string, value: Json) => Promise<void>;
  keys?: () => Promise<string[]>;
};

export type PlannerFn = (goal: AgentGoal, ctx: AgentContext) => Promise<PlannerOutput>;

export type ToolInvoker = {
  has: (name: string) => boolean;
  call: (name: string, input?: Json) => Promise<ToolResult>;
};