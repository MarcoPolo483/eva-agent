# eva-agent (Enterprise Edition)

Agent runtime for EVA 2.0:
- Planner/executor loop
- Tool registry with budgets
- In-memory conversation & short-term memory
- Enterprise toolchain: ESLint v9 flat config, Prettier, Vitest coverage, Husky

## Quick example
```ts
import { Agent, ToolRegistry, InMemoryMemory, simplePlanner } from "./dist/index.js";

const memory = new InMemoryMemory();
const tools = new ToolRegistry().register({
  name: "echo",
  estimateTokens: (i) => 10,
  invoke: async (i) => ({ ok: true, value: { text: String(i?.text || "") } })
});
const agent = new Agent({ memory, tools, tokenLimit: 100 });
const result = await agent.run({ goal: "say hello", input: { text: "hello" }, planner: simplePlanner });
```