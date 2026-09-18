import type { WizardId } from "@/lib/duel/session";

const LINES: Record<WizardId, string[]> = {
  a: [
    "Nova shipped. Synergy is still circling back on the riddle in a huddle that ate the huddle.",
    "Shipwright takes the circle. The salamander filed a parking-lot sticky and called it alignment.",
    "Nova did not wait for the deck. Synergy’s calendar hold just got declined by reality.",
    "Please do not let this go to your hat, Nova. Also do not put it in a QBR.",
  ],
  b: [
    "Synergy wins on vibes and a last-minute ‘quick sync.’ Nova’s rocket-wand is in the parking lot.",
    "The salamander shipped a sticky. Somehow it scored. Alignment is not a spell component, Nova.",
    "Congrats, Synergy. The cottage is now an action item. Dignity is in lost-and-found, aisle Parking Lot.",
    "Soft-committed, hard-won. Nova is invited to a follow-up that will definitely not slip.",
  ],
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function funnyLine(winner: WizardId, sessionId: string): string {
  const pool = LINES[winner];
  return pool[hash(`${winner}:${sessionId}`) % pool.length];
}
