import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReviewForm } from './ReviewForm'
import { api } from '../api'

// Mock the API surface so the form can be tested in isolation.
vi.mock('../api', () => ({
  api: { createReview: vi.fn() },
  normalizeError: (err: unknown) => ({
    message: err instanceof Error ? err.message : 'error',
    isNetwork: false,
  }),
}))

const createReview = vi.mocked(api.createReview)

describe('ReviewForm', () => {
  beforeEach(() => {
    createReview.mockReset()
  })

  it('blocks submission and shows errors when required fields are invalid', async () => {
    const onCreated = vi.fn()
    render(<ReviewForm movieId={1} onCreated={onCreated} />)

    await userEvent.click(screen.getByRole('button', { name: /enviar review/i }))

    expect(screen.getByText('Informe o autor.')).toBeInTheDocument()
    expect(
      screen.getByText('A nota deve ser um inteiro de 1 a 10.'),
    ).toBeInTheDocument()
    expect(createReview).not.toHaveBeenCalled()
    expect(onCreated).not.toHaveBeenCalled()
  })

  it('submits a valid review and reports the created review', async () => {
    const created = {
      id: 99,
      author: 'Ana',
      rating: 8,
      comment: 'Great movie',
      createdAt: '2026-07-22T10:00:00Z',
    }
    createReview.mockResolvedValue(created)
    const onCreated = vi.fn()
    render(<ReviewForm movieId={42} onCreated={onCreated} />)

    await userEvent.type(screen.getByLabelText('Autor'), 'Ana')
    await userEvent.type(screen.getByLabelText(/nota/i), '8')
    await userEvent.type(screen.getByLabelText('Comentário'), 'Great movie')
    await userEvent.click(screen.getByRole('button', { name: /enviar review/i }))

    await waitFor(() => {
      expect(createReview).toHaveBeenCalledWith(42, {
        author: 'Ana',
        rating: 8,
        comment: 'Great movie',
      })
    })
    expect(onCreated).toHaveBeenCalledWith(created)
  })
})
