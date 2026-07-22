import './SearchBar.css'

interface SearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  genre: string
  genres: string[]
  onGenreChange: (value: string) => void
}

export function SearchBar({
  search,
  onSearchChange,
  genre,
  genres,
  onGenreChange,
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <div className="search-field">
        <span className="search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          type="search"
          className="search-input"
          placeholder="Buscar por título…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Buscar filmes por título"
        />
      </div>

      <select
        className="search-genre"
        value={genre}
        onChange={(event) => onGenreChange(event.target.value)}
        aria-label="Filtrar por gênero"
      >
        <option value="">Todos os gêneros</option>
        {genres.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
