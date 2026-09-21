import { TEX } from "../lib/block-textures";

export type BlockKey = keyof typeof TEX;

/// A Minecraft block face as decorative art — the same generated textures as
/// the page background and footer hotbar, drawn as a bevelled inventory tile.
export function BlockArt({ block, className = "h-12 w-12" }: { block: BlockKey; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-lg ring-1 ring-black/50 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.9),inset_0_2px_0_rgba(255,255,255,0.2),inset_0_-4px_0_rgba(0,0,0,0.38)] ${className}`}
      style={{ backgroundImage: TEX[block], backgroundSize: "100% 100%", imageRendering: "pixelated" }}
    />
  );
}
