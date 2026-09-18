"use client";

type MediaFrameProps = {
  src: string;
  alt: string;
  caption?: string;
  tone?: "a" | "b" | "true" | "plain";
  fallbackSrc?: string;
};

export function MediaFrame({
  src,
  alt,
  caption,
  tone = "plain",
  fallbackSrc,
}: MediaFrameProps) {
  return (
    <figure className={`media-frame tone-${tone}`}>
      {/* PNG stills preferred; SVG stubs are fallback via onError. */}
      <img
        src={src}
        alt={alt}
        width={1280}
        height={720}
        data-fallback={fallbackSrc}
        onError={(event) => {
          const el = event.currentTarget;
          const next = el.dataset.fallback;
          if (next && !el.dataset.fellBack) {
            el.dataset.fellBack = "1";
            el.src = next;
          }
        }}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
