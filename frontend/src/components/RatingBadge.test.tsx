import { render, screen } from '@testing-library/react'
import { RatingBadge } from './RatingBadge'

describe('RatingBadge', () => {
  it('shows the rating with one decimal when a number is given', () => {
    render(<RatingBadge rating={8.4} />)
    expect(screen.getByText('8.4')).toBeInTheDocument()
  })

  it('shows a placeholder (not a crash) when avgRating is null', () => {
    // Regression: the real API sends null avgRating for movies without reviews.
    render(<RatingBadge rating={null} />)
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.getByTitle('Sem avaliações')).toBeInTheDocument()
  })
})
