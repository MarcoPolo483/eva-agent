import { Agent } from "../runtime/agent.js";
import { InMemoryMemory } from "../memory/in-memory.js";
import { ToolRegistry } from "../tools/registry.js";

async function main() {
  const memory = new InMemoryMemory();
  const tools = new ToolRegistry(100).register({
    name: "echo",
    estimateTokens: (i) => 10,
    invoke: async (i) => ({ ok: true, value: { text: String((i as any)?.text ?? "") } })
  });

  const agent = new Agent({ memory, tools, tokenLimit: 100 });
  const result = await agent.run({ goal: "echo", input: { text: "hello" } });
  console.log("ok:", result.ok);
}
void main();