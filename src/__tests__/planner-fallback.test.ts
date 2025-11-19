import { describe, it, expect } from "vitest";

import { simplePlanner } from "../planner/planner.js";
import type { AgentGoal } from "../types.js";

describe("simplePlanner fallback path", () => {
  it("should return a single echo step when goal has no structured steps", async () => {
    const goal: AgentGoal = {
      goal: "test goal",
      input: { message: "hello world" },
    };

    const result = await simplePlanner(goal, {} as any);

    expect(result).toEqual({
      steps: [{ tool: "echo", input: { message: "hello world" } }],
    });
  });

  it("should return a single echo step when goal input is undefined", async () => {
    const goal: AgentGoal = {
      goal: "simple goal",
    };

    const result = await simplePlanner(goal, {} as any);

    expect(result).toEqual({
      steps: [{ tool: "echo", input: undefined }],
    });
  });

  it("should return a single echo step when goal input is a string", async () => {
    const goal: AgentGoal = {
      goal: "string input goal",
      input: "just a string",
    };

    const result = await simplePlanner(goal, {} as any);

    expect(result).toEqual({
      steps: [{ tool: "echo", input: "just a string" }],
    });
  });
});
