import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, normalizeError } from '../api'
import type { MovieSummary, NormalizedError } from '../api'
import { MovieGrid, MovieGridSkeleton } from '../components/MovieGrid'
import { StateMessage } from '../components/StateMessage'
import './FavoritesPage.css'

type Status = 'loading' | 'success' | 'error'

export function FavoritesPage() {
  const [movies, setMovies] = useState<MovieSummary[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<NormalizedError | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setStatus('loading')
    setError(null)

    api
      .getFavorites()
      .then((list) => {
        if (!active) return
        setMovies(list)
        setStatus('success')
      })
      .catch((err) => {
        if (!active) return
        setError(normalizeError(err))
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [reloadKey])

  // Un-favoriting from a card removes it from this list.
  function handleFavoriteChange(movieId: number, favorite: boolean) {
    setMovies((prev) =>
      favorite
        ? prev.map((movie) =>
            movie.id === movieId ? { ...movie, favorite } : movie,
          )
        : prev.filter((movie) => movie.id !== movieId),
    )
  }

  return (
    <div className="page">
      <header className="favorites-header">
        <h1>Meus favoritos</h1>
        {status === 'success' && movies.length > 0 && (
          <p className="favorites-count">
            {movies.length} {movies.length === 1 ? 'filme' : 'filmes'}
          </p>
        )}
      </header>

      {status === 'loading' && <MovieGridSkeleton count={6} />}

      {status === 'error' && (
        <StateMessage
          icon="⚠️"
          title="Não foi possível carregar os favoritos"
          description={error?.message}
          actionLabel="Tentar novamente"
          onAction={() => setReloadKey((key) => key + 1)}
        />
      )}

      {status === 'success' && movies.length === 0 && (
        <StateMessage
          icon="💔"
          title="Você ainda não tem favoritos"
          description="Explore o catálogo e toque no coração para salvar filmes aqui."
        />
      )}

      {status === 'success' && movies.length > 0 && (
        <MovieGrid movies={movies} onFavoriteChange={handleFavoriteChange} />
      )}

      {status === 'success' && movies.length === 0 && (
        <div className="favorites-cta">
          <Link to="/" className="btn btn-primary">
            Explorar catálogo
          </Link>
        </div>
      )}
    </div>
  )
}
