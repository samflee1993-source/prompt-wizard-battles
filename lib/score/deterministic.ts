/**
 * POC deterministic half (0..100).
 *
 * Metric: lexical overlap of the wizard's spell against the canned pack's
 * `targetKeywords` (the hidden prompt-method hinted by the riddle).
 * Not pixel/histogram distance — placeholder SVGs would barely differ, and
 * the demo is more honest if a closer spell scores higher.
 *
 * Plug-in later: CLIP / LPIPS / embedding cosine vs the true after image.
 */
export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(
    (t) => t.length > 2,
  );
}

export function deterministicSimilarity(
  spell: string,
  targetKeywords: string[],
): number {
  if (!spell.trim() || targetKeywords.length === 0) return 12;

  const tokens = new Set(tokenize(spell));
  const haystack = spell.toLowerCase();
  let hits = 0;
  for (const raw of targetKeywords) {
    const key = raw.toLowerCase();
    if (tokens.has(key) || haystack.includes(key)) hits += 1;
  }

  const ratio = hits / targetKeywords.length;
  // Floor so empty-ish spells still register; cap below 100 unless almost all keywords land.
  return Math.round(Math.min(98, 14 + ratio * 86));
}
