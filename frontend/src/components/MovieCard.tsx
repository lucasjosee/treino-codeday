import { Link } from 'react-router-dom'
import type { MovieSummary } from '../api'
import { handlePosterError } from '../lib/posterFallback'
import { FavoriteButton } from './FavoriteButton'
import { RatingBadge } from './RatingBadge'
import './MovieCard.css'

interface MovieCardProps {
  movie: MovieSummary
  onFavoriteChange: (movieId: number, favorite: boolean) => void
}

export function MovieCard({ movie, onFavoriteChange }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card-poster">
        <Link
          to={`/movies/${movie.id}`}
          className="movie-card-poster-link"
          aria-label={movie.title}
        >
          <img
            src={movie.posterUrl}
            alt={`Pôster de ${movie.title}`}
            loading="lazy"
            onError={handlePosterError}
          />
        </Link>
        <div className="movie-card-fav">
          <FavoriteButton
            movieId={movie.id}
            favorite={movie.favorite}
            onChange={(favorite) => onFavoriteChange(movie.id, favorite)}
          />
        </div>
      </div>

      <div className="movie-card-body">
        <Link to={`/movies/${movie.id}`} className="movie-card-title-link">
          <h3 className="movie-card-title">{movie.title}</h3>
        </Link>
        <div className="movie-card-meta">
          <span className="movie-card-year">{movie.year}</span>
          <RatingBadge rating={movie.avgRating} />
        </div>
      </div>
    </article>
  )
}
