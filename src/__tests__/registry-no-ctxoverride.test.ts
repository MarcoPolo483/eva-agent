import { describe, it, expect } from "vitest";

import { ToolRegistry } from "../tools/registry.js";

describe("ToolRegistry.call without ctxOverride", () => {
  it("invokes tool that does not rely on ctx.memory", async () => {
    const reg = new ToolRegistry(10);
    reg.register({
      name: "no-ctx",
      invoke: async () => ({ ok: true, value: { ok: true } }),
    });
    // No ctxOverride passed here – exercises the branch that builds ctx with possibly undefined memory
    const res = await reg.call("no-ctx");
    expect(res.ok).toBe(true);
  });
});
