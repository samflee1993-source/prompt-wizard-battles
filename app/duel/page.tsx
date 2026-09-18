import type { Metadata } from "next";
import { DuelClient } from "./DuelClient";

export const metadata: Metadata = {
  title: "The duel",
  description:
    "Before + riddle, two spells, parallel casting, scores, and a funny winner.",
};

export default function DuelPage() {
  return <DuelClient />;
}
