import type { Review } from '../api'
import './ReviewList.css'

interface ReviewListProps {
  reviews: Review[]
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="review-empty">
        Ainda não há reviews. Seja o primeiro a avaliar!
      </p>
    )
  }

  return (
    <ul className="review-list">
      {reviews.map((review) => (
        <li className="review-item" key={review.id}>
          <div className="review-head">
            <span className="review-author">{review.author}</span>
            <span className="review-rating">
              <span className="rating-star" aria-hidden="true">
                ★
              </span>
              {review.rating}/10
            </span>
          </div>
          {review.comment && (
            <p className="review-comment">{review.comment}</p>
          )}
          <time className="review-date" dateTime={review.createdAt}>
            {formatDate(review.createdAt)}
          </time>
        </li>
      ))}
    </ul>
  )
}
