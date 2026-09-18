export interface ImageGenProvider {
  cast(input: {
    beforeUrl: string;
    spell: string;
    seed?: string;
  }): Promise<{ imageUrl: string; meta?: Record<string, unknown> }>;
}
