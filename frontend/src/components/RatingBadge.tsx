import './RatingBadge.css'

interface RatingBadgeProps {
  rating: number
}

export function RatingBadge({ rating }: RatingBadgeProps) {
  return (
    <span className="rating-badge" title={`Nota média ${rating.toFixed(1)}`}>
      <span className="rating-star" aria-hidden="true">
        ★
      </span>
      {rating.toFixed(1)}
    </span>
  )
}
