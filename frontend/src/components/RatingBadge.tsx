import './RatingBadge.css'

interface RatingBadgeProps {
  // Null when the movie has no reviews yet (real API sends null avgRating).
  rating: number | null
}

export function RatingBadge({ rating }: RatingBadgeProps) {
  if (rating === null || !Number.isFinite(rating)) {
    return (
      <span className="rating-badge rating-badge-empty" title="Sem avaliações">
        —
      </span>
    )
  }

  return (
    <span className="rating-badge" title={`Nota média ${rating.toFixed(1)}`}>
      <span className="rating-star" aria-hidden="true">
        ★
      </span>
      {rating.toFixed(1)}
    </span>
  )
}
