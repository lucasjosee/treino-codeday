import './Pagination.css'

interface PaginationProps {
  page: number // zero-based index of the current page
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const canPrev = page > 0
  const canNext = page < totalPages - 1

  return (
    <nav className="pagination" aria-label="Paginação">
      <button
        type="button"
        className="btn"
        onClick={() => onChange(page - 1)}
        disabled={!canPrev}
      >
        ← Anterior
      </button>
      <span className="pagination-status" aria-live="polite">
        Página {page + 1} de {totalPages}
      </span>
      <button
        type="button"
        className="btn"
        onClick={() => onChange(page + 1)}
        disabled={!canNext}
      >
        Próxima →
      </button>
    </nav>
  )
}
