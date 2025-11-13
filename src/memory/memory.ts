import type { Memory, Json } from "../types.js";

export abstract class BaseMemory implements Memory {
  abstract put(key: string, value: Json): Promise<void>;
  abstract get(key: string): Promise<Json | undefined>;
  async append(key: string, value: Json): Promise<void> {
    const existing = (await this.get(key)) ?? [];
    if (!Array.isArray(existing)) throw new Error("append target is not an array");
    existing.push(value);
    await this.put(key, existing);
  }
  async keys(): Promise<string[]> {
    return [];
  }
}