/**
 * The Pointer animation — on point, sits, returns to point. A seamless loop,
 * derived from pointer.mp4 and recoloured to the site's amber.
 *
 * Delivered as an animated WebP with an alpha channel rather than a video:
 * it needs transparency over the page background, autoplays without the
 * inline/muted incantations mobile browsers demand of <video>, and at 165KB
 * it costs less than the MP4 did.
 *
 * Anyone who has asked their system to reduce motion gets the still frame,
 * which is the same pose the loop starts and ends on.
 */
export function AnimatedPointer({
  className,
  alt = "",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <>
      <img
        src="/pointer-loop.webp"
        alt={alt}
        aria-hidden={alt === "" || undefined}
        width={256}
        height={256}
        decoding="async"
        className={`motion-reduce:hidden ${className ?? ""}`}
      />
      <img
        src="/pointer-still.png"
        alt={alt}
        aria-hidden={alt === "" || undefined}
        width={256}
        height={256}
        decoding="async"
        className={`hidden motion-reduce:block ${className ?? ""}`}
      />
    </>
  );
}
