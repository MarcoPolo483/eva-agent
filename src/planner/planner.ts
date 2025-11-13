import type { AgentGoal, PlannerFn, PlannerOutput } from "../types.js";

/**
 * A trivial planner: converts the goal into a single 'echo' tool step if present,
 * otherwise returns the steps declared in goal.input?.steps if structured.
 */
export const simplePlanner: PlannerFn = async (goal): Promise<PlannerOutput> => {
  const input = goal.input as any;
  if (input?.steps && Array.isArray(input.steps)) {
    return { steps: input.steps.map((s: any) => ({ tool: s.tool, input: s.input })) };
  }
  // fall back to a single echo if nothing else
  return { steps: [{ tool: "echo", input: goal.input }] };
};