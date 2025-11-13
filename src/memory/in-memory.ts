import type { Json } from "../types.js";

import { BaseMemory } from "./memory.js";

export class InMemoryMemory extends BaseMemory {
  private store = new Map<string, Json>();
  async put(key: string, value: Json) { this.store.set(key, value); }
  async get(key: string) { return this.store.get(key); }
  async append(key: string, value: Json) {
    const arr = (await this.get(key)) as Json[] | undefined;
    if (!arr) { await this.put(key, [value]); return; }
    if (!Array.isArray(arr)) throw new Error("append target is not an array");
    arr.push(value);
    await this.put(key, arr);
  }
  async keys(): Promise<string[]> { return Array.from(this.store.keys()); }
}