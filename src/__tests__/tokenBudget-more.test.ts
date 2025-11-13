import { describe, it, expect } from "vitest";
import { TokenBudget } from "../budget/tokenBudget.js";

describe("TokenBudget additional coverage", () => {
  it("allows exact limit then blocks further spend", () => {
    const b = new TokenBudget(10);
    b.spend(10);
    expect(b.remaining()).toBe(0);
    expect(() => b.spend(1)).toThrow(/exceed/i);
  });

  it("reset restores full limit", () => {
    const b = new TokenBudget(5);
    b.spend(3);
    expect(b.remaining()).toBe(2);
    b.reset();
    expect(b.remaining()).toBe(5);
  });

  it("throws on negative spend", () => {
    const b = new TokenBudget(5);
    expect(() => b.spend(-1)).toThrow(/negative/i);
  });
});