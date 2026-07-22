import type { SyntheticEvent } from 'react'

// Rendered when a poster URL fails to load (e.g. a real API poster is offline).
export const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450'>" +
      "<rect width='300' height='450' fill='#1e1e28'/>" +
      "<text x='150' y='225' fill='#6b6b7a' font-family='sans-serif' " +
      "font-size='60' text-anchor='middle'>🎬</text></svg>",
  )

// Swaps the element's src to the fallback, guarding against an error loop.
export function handlePosterError(
  event: SyntheticEvent<HTMLImageElement>,
): void {
  const img = event.currentTarget
  if (img.src !== FALLBACK_POSTER) img.src = FALLBACK_POSTER
}
