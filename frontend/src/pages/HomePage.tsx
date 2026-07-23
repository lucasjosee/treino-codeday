import { useEffect, useState } from 'react'
import { api, normalizeError } from '../api'
import type { MovieSummary, NormalizedError } from '../api'
import { useDebounce } from '../hooks/useDebounce'
import { SearchBar } from '../components/SearchBar'
import { MovieGrid, MovieGridSkeleton } from '../components/MovieGrid'
import { Pagination } from '../components/Pagination'
import { StateMessage } from '../components/StateMessage'
import './HomePage.css'

const PAGE_SIZE = 12

type Status = 'loading' | 'success' | 'error'

export function HomePage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [genre, setGenre] = useState('')
  const [page, setPage] = useState(0)

  const [movies, setMovies] = useState<MovieSummary[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [genres, setGenres] = useState<string[]>([])

  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<NormalizedError | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  // Load the genre list once.
  useEffect(() => {
    let active = true
    api
      .getGenres()
      .then((list) => {
        if (active) setGenres(list)
      })
      .catch(() => {
        // Non-critical: the filter just stays empty if this fails.
      })
    return () => {
      active = false
    }
  }, [])

  // Any change to the filters brings us back to the first page.
  useEffect(() => {
    setPage(0)
  }, [debouncedSearch, genre])

  // Load the current page of movies.
  useEffect(() => {
    let active = true
    setStatus('loading')
    setError(null)

    api
      .getMovies({ page, size: PAGE_SIZE, search: debouncedSearch, genre })
      .then((result) => {
        if (!active) return
        setMovies(result.content)
        setTotalPages(result.totalPages)
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
  }, [page, debouncedSearch, genre, reloadKey])

  function handleFavoriteChange(movieId: number, favorite: boolean) {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === movieId ? { ...movie, favorite } : movie,
      ),
    )
  }

  function goToPage(next: number) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page">
      <header className="home-header">
        <h1>Filmes</h1>
        {status === 'success' && (
          <p className="home-count">
            {movies.length} {movies.length === 1 ? 'filme' : 'filmes'}
          </p>
        )}
      </header>

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        genre={genre}
        genres={genres}
        onGenreChange={setGenre}
      />

      {status === 'loading' && <MovieGridSkeleton count={PAGE_SIZE} />}

      {status === 'error' && (
        <StateMessage
          icon="⚠️"
          title="Não foi possível carregar os filmes"
          description={error?.message}
          actionLabel="Tentar novamente"
          onAction={() => setReloadKey((key) => key + 1)}
        />
      )}

      {status === 'success' && movies.length === 0 && (
        <StateMessage
          icon="🔍"
          title="Nenhum filme encontrado"
          description="Tente ajustar a busca ou o filtro de gênero."
        />
      )}

      {status === 'success' && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onFavoriteChange={handleFavoriteChange} />
          <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
        </>
      )}
    </div>
  )
}
