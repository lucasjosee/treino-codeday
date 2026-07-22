import { useState } from 'react'
import type { FormEvent } from 'react'
import { api, normalizeError } from '../api'
import type { Review } from '../api'
import './ReviewForm.css'

interface ReviewFormProps {
  movieId: number
  onCreated: (review: Review) => void
}

const MAX_AUTHOR = 60
const MAX_COMMENT = 500

// Client-side validation mirrors the contract (author 1..60, rating int 1..10,
// comment 0..500). Server 400 field errors, if any, are merged in afterwards.
function validate(
  author: string,
  rating: string,
  comment: string,
): Record<string, string> {
  const errors: Record<string, string> = {}
  const trimmedAuthor = author.trim()

  if (trimmedAuthor.length < 1) {
    errors.author = 'Informe o autor.'
  } else if (trimmedAuthor.length > MAX_AUTHOR) {
    errors.author = `Máximo de ${MAX_AUTHOR} caracteres.`
  }

  const numericRating = Number(rating)
  if (
    rating.trim() === '' ||
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 10
  ) {
    errors.rating = 'A nota deve ser um inteiro de 1 a 10.'
  }

  if (comment.length > MAX_COMMENT) {
    errors.comment = `Máximo de ${MAX_COMMENT} caracteres.`
  }

  return errors
}

export function ReviewForm({ movieId, onCreated }: ReviewFormProps) {
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverMessage, setServerMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setServerMessage(null)

    const clientErrors = validate(author, rating, comment)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) return

    setSubmitting(true)
    try {
      const created = await api.createReview(movieId, {
        author: author.trim(),
        rating: Number(rating),
        comment: comment.trim(),
      })
      onCreated(created)
      // Reset for the next review.
      setAuthor('')
      setRating('')
      setComment('')
      setErrors({})
    } catch (err) {
      const normalized = normalizeError(err)
      // Surface server-side validation (400) errors on the matching fields.
      if (normalized.fieldErrors) setErrors(normalized.fieldErrors)
      setServerMessage(normalized.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <h3 className="review-form-title">Escrever uma review</h3>

      {serverMessage && (
        <p className="review-form-server-error" role="alert">
          {serverMessage}
        </p>
      )}

      <div className="review-form-row">
        <div className="review-form-field">
          <label htmlFor="review-author">Autor</label>
          <input
            id="review-author"
            type="text"
            value={author}
            maxLength={MAX_AUTHOR + 10}
            onChange={(event) => setAuthor(event.target.value)}
            aria-invalid={Boolean(errors.author)}
          />
          {errors.author && (
            <span className="field-error">{errors.author}</span>
          )}
        </div>

        <div className="review-form-field review-form-rating">
          <label htmlFor="review-rating">Nota (1–10)</label>
          <input
            id="review-rating"
            type="number"
            min={1}
            max={10}
            step={1}
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            aria-invalid={Boolean(errors.rating)}
          />
          {errors.rating && (
            <span className="field-error">{errors.rating}</span>
          )}
        </div>
      </div>

      <div className="review-form-field">
        <label htmlFor="review-comment">Comentário</label>
        <textarea
          id="review-comment"
          rows={3}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          aria-invalid={Boolean(errors.comment)}
        />
        <div className="review-form-meta">
          {errors.comment ? (
            <span className="field-error">{errors.comment}</span>
          ) : (
            <span />
          )}
          <span className="review-form-count">
            {comment.length}/{MAX_COMMENT}
          </span>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Enviando…' : 'Enviar review'}
      </button>
    </form>
  )
}
