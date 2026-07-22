import './StateMessage.css'

interface StateMessageProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

// Generic centered message block for empty states and recoverable errors.
export function StateMessage({
  icon = 'ℹ️',
  title,
  description,
  actionLabel,
  onAction,
}: StateMessageProps) {
  return (
    <div className="state-message" role="status">
      <div className="state-message-icon" aria-hidden="true">
        {icon}
      </div>
      <h2 className="state-message-title">{title}</h2>
      {description && <p className="state-message-desc">{description}</p>}
      {actionLabel && onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
