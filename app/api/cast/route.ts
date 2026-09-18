import { NextResponse } from "next/server";
import { getImageGenProvider } from "@/lib/gen";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { beforeUrl, spell, seed } = (body ?? {}) as {
    beforeUrl?: string;
    spell?: string;
    seed?: string;
  };

  if (!beforeUrl || typeof beforeUrl !== "string") {
    return NextResponse.json({ error: "beforeUrl required" }, { status: 400 });
  }
  if (!spell || typeof spell !== "string" || !spell.trim()) {
    return NextResponse.json({ error: "spell required" }, { status: 400 });
  }

  const gen = getImageGenProvider();
  const result = await gen.cast({ beforeUrl, spell: spell.trim(), seed });
  return NextResponse.json(result);
}
