import { StubImageGen } from "@/lib/gen/stub";
import type { ImageGenProvider } from "@/lib/gen/types";

export type { ImageGenProvider } from "@/lib/gen/types";

/** Factory: real providers later. POC always falls back to StubImageGen. */
export function getImageGenProvider(): ImageGenProvider {
  const name = (process.env.IMAGE_GEN_PROVIDER ?? "stub").toLowerCase();
  if (name !== "stub" && name !== "") {
    console.warn(
      `[gen] IMAGE_GEN_PROVIDER=${name} is not wired in this POC; using StubImageGen`,
    );
  }
  return new StubImageGen();
}

export function isGenStubbed(): boolean {
  const name = (process.env.IMAGE_GEN_PROVIDER ?? "stub").toLowerCase();
  return name === "stub" || name === "" || !process.env.IMAGE_GEN_API_KEY;
}
