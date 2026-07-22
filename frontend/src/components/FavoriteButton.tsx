import { useState } from 'react'
import type { MouseEvent } from 'react'
import { api, normalizeError } from '../api'
import './FavoriteButton.css'

interface FavoriteButtonProps {
  movieId: number
  favorite: boolean
  onChange: (favorite: boolean) => void
  variant?: 'icon' | 'full'
}

// Self-contained favorite toggle: performs the API call and reports the new
// state back through onChange so the parent can update its list/detail.
export function FavoriteButton({
  movieId,
  favorite,
  onChange,
  variant = 'icon',
}: FavoriteButtonProps) {
  const [busy, setBusy] = useState(false)

  async function toggle(event: MouseEvent) {
    // The button often sits inside a card <Link>; don't navigate on click.
    event.preventDefault()
    event.stopPropagation()
    if (busy) return

    const next = !favorite
    setBusy(true)
    try {
      if (next) {
        await api.addFavorite(movieId)
      } else {
        await api.removeFavorite(movieId)
      }
      onChange(next)
    } catch (err) {
      console.error('Falha ao atualizar favorito:', normalizeError(err).message)
    } finally {
      setBusy(false)
    }
  }

  const label = favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'

  return (
    <button
      type="button"
      className={`fav-btn fav-btn-${variant}${favorite ? ' is-active' : ''}`}
      onClick={toggle}
      disabled={busy}
      aria-pressed={favorite}
      aria-label={label}
      title={label}
    >
      <span className="fav-heart" aria-hidden="true">
        {favorite ? '♥' : '♡'}
      </span>
      {variant === 'full' && (
        <span>{favorite ? 'Nos favoritos' : 'Favoritar'}</span>
      )}
    </button>
  )
}
