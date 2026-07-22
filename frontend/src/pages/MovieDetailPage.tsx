import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, normalizeError } from '../api'
import type { MovieDetail, NormalizedError, Review } from '../api'
import { handlePosterError } from '../lib/posterFallback'
import { RatingBadge } from '../components/RatingBadge'
import { FavoriteButton } from '../components/FavoriteButton'
import { ReviewForm } from '../components/ReviewForm'
import { ReviewList } from '../components/ReviewList'
import { Spinner } from '../components/Spinner'
import { StateMessage } from '../components/StateMessage'
import './MovieDetailPage.css'

type Status = 'loading' | 'success' | 'notfound' | 'error'

export function MovieDetailPage() {
  const { id } = useParams()
  const movieId = Number(id)
  const navigate = useNavigate()

  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<NormalizedError | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!Number.isInteger(movieId) || movieId <= 0) {
      setStatus('notfound')
      return
    }

    let active = true
    setStatus('loading')
    setError(null)

    Promise.all([api.getMovie(movieId), api.getReviews(movieId)])
      .then(([detail, reviewList]) => {
        if (!active) return
        setMovie(detail)
        setReviews(reviewList)
        setStatus('success')
      })
      .catch((err) => {
        if (!active) return
        const normalized = normalizeError(err)
        if (normalized.status === 404) {
          setStatus('notfound')
        } else {
          setError(normalized)
          setStatus('error')
        }
      })

    return () => {
      active = false
    }
  }, [movieId, reloadKey])

  function handleReviewCreated(review: Review) {
    setReviews((prev) => [review, ...prev])
    setMovie((prev) =>
      prev ? { ...prev, reviewCount: prev.reviewCount + 1 } : prev,
    )
  }

  function handleFavoriteChange(favorite: boolean) {
    setMovie((prev) => (prev ? { ...prev, favorite } : prev))
  }

  if (status === 'loading') {
    return (
      <div className="page">
        <Spinner label="Carregando filme…" />
      </div>
    )
  }

  if (status === 'notfound') {
    return (
      <div className="page">
        <StateMessage
          icon="🎞️"
          title="Filme não encontrado"
          description="O filme que você procura não existe ou foi removido."
          actionLabel="Voltar para o início"
          onAction={() => navigate('/')}
        />
      </div>
    )
  }

  if (status === 'error' || !movie) {
    return (
      <div className="page">
        <StateMessage
          icon="⚠️"
          title="Não foi possível carregar o filme"
          description={error?.message}
          actionLabel="Tentar novamente"
          onAction={() => setReloadKey((key) => key + 1)}
        />
      </div>
    )
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">
        ← Voltar para o catálogo
      </Link>

      <article className="detail">
        <div className="detail-poster">
          <img
            src={movie.posterUrl}
            alt={`Pôster de ${movie.title}`}
            onError={handlePosterError}
          />
        </div>

        <div className="detail-info">
          <h1 className="detail-title">
            {movie.title} <span className="detail-year">({movie.year})</span>
          </h1>

          <div className="detail-meta">
            <RatingBadge rating={movie.avgRating} />
            <span className="detail-genre">{movie.genre}</span>
            <span>{movie.durationMin} min</span>
            <span>
              {movie.reviewCount}{' '}
              {movie.reviewCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <p className="detail-director">
            <span className="detail-label">Diretor:</span> {movie.director}
          </p>
          <p className="detail-synopsis">{movie.synopsis}</p>

          <FavoriteButton
            variant="full"
            movieId={movie.id}
            favorite={movie.favorite}
            onChange={handleFavoriteChange}
          />
        </div>
      </article>

      <section className="detail-reviews">
        <h2 className="detail-reviews-title">Reviews ({movie.reviewCount})</h2>
        <ReviewForm movieId={movie.id} onCreated={handleReviewCreated} />
        <ReviewList reviews={reviews} />
      </section>
    </div>
  )
}
