/**
 * The Pointer animation — on point, sits, returns to point. A seamless loop,
 * derived from pointer-l.mp4 and recoloured to the site's amber (#D97706).
 *
 * Delivered as an animated WebP with an alpha channel rather than a video:
 * it needs transparency over the page background, autoplays without the
 * inline/muted incantations mobile browsers demand of <video>, and at 122KB
 * it costs a fraction of the 1.4MB source.
 *
 * The source is 624px at 24fps; a straight resize to 256 reproduces the
 * original's on-screen scale exactly. Runs of frames the eye cannot separate
 * are stored once with a longer duration, which is what keeps the file small
 * over a 12.7s loop.
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
