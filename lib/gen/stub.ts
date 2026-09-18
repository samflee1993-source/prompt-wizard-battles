import { getPack } from "@/lib/duel/pack";
import type { ImageGenProvider } from "@/lib/gen/types";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Ignores spell semantics. Returns canned stub outputs after a short delay
 * so the parallel casting wait animation has something to do.
 */
export class StubImageGen implements ImageGenProvider {
  async cast(input: {
    beforeUrl: string;
    spell: string;
    seed?: string;
  }): Promise<{ imageUrl: string; meta?: Record<string, unknown> }> {
    const pack = getPack();
    const wizard = (input.seed ?? "a").toLowerCase().includes("b") ? "b" : "a";
    // Stagger slightly so Promise.all still waits on the slower sibling (~max, not sum).
    const delayedMs = wizard === "b" ? 1550 : 1200;
    await sleep(delayedMs);
    return {
      imageUrl: wizard === "b" ? pack.stubOutB : pack.stubOutA,
      meta: {
        provider: "stub",
        wizard,
        delayedMs,
        ignoredSpellChars: input.spell.length,
      },
    };
  }
}
