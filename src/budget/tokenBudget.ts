export class TokenBudget {
  private used = 0;
  constructor(private readonly limit: number) {
    if (limit <= 0) throw new Error("TokenBudget.limit must be > 0");
  }
  spend(n: number) {
    if (n < 0) throw new Error("Cannot spend negative tokens");
    if (this.used + n > this.limit) throw new Error("Budget exceeded");
    this.used += n;
  }
  remaining() { return this.limit - this.used; }
  reset() { this.used = 0; }
}