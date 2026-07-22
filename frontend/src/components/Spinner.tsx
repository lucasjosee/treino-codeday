import './Spinner.css'

interface SpinnerProps {
  label?: string
}

export function Spinner({ label = 'Carregando…' }: SpinnerProps) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <span className="spinner-circle" aria-hidden="true" />
      <span className="spinner-label">{label}</span>
    </div>
  )
}
