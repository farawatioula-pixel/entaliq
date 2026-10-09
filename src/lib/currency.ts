// All prices are entered by sellers and stored in the database as JOD (Jordanian Dinar) —
// this has not changed. The Jordanian Dinar has been pegged to the US Dollar since 1995 at
// 0.709 JOD = 1 USD, so we use that fixed peg for display conversion rather than a live FX
// rate. CliQ (the only payment rail wired up) only accepts JOD transfers, so the amount a
// buyer is told to actually send always stays in JOD — USD is shown for reference only.
export const JOD_PER_USD = 0.709;

export function jodToUsd(jod: number): number {
  return jod / JOD_PER_USD;
}

export function usdToJod(usd: number): number {
  return usd * JOD_PER_USD;
}

export type DisplayCurrency = "USD" | "JOD";

// Format a JOD amount (as stored) for display in the given currency.
export function formatPrice(jodAmount: number, currency: DisplayCurrency = "USD"): string {
  if (currency === "USD") {
    return `$${jodToUsd(jodAmount).toFixed(2)}`;
  }
  return `JOD ${jodAmount.toFixed(2)}`;
}
