import type { MovieSummary } from '../api'
import { MovieCard } from './MovieCard'
import './MovieGrid.css'

interface MovieGridProps {
  movies: MovieSummary[]
  onFavoriteChange: (movieId: number, favorite: boolean) => void
}

export function MovieGrid({ movies, onFavoriteChange }: MovieGridProps) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onFavoriteChange={onFavoriteChange}
        />
      ))}
    </div>
  )
}

// Placeholder grid rendered while a page of movies is loading.
export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="movie-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="movie-skeleton" key={index}>
          <div className="movie-skeleton-poster" />
          <div className="movie-skeleton-line" />
          <div className="movie-skeleton-line short" />
        </div>
      ))}
    </div>
  )
}
