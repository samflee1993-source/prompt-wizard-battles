import type { Metadata } from "next";
import { DuelClient } from "./DuelClient";

export const metadata: Metadata = {
  title: "The Arena",
  description:
    "Before + riddle, one spell on a 90s clock, rival mock compare, scores, and a funny winner.",
};

export default function DuelPage() {
  return (
    <div className="duel-frame">
      <DuelClient />
    </div>
  );
}
