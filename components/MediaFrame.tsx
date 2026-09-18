type MediaFrameProps = {
  src: string;
  alt: string;
  caption?: string;
  tone?: "a" | "b" | "true" | "plain";
};

export function MediaFrame({ src, alt, caption, tone = "plain" }: MediaFrameProps) {
  return (
    <figure className={`media-frame tone-${tone}`}>
      {/* SVG placeholders are static assets; next/image is unnecessary here. */}
      <img src={src} alt={alt} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
