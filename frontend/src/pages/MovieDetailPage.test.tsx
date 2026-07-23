import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { MovieDetailPage } from './MovieDetailPage'

// Drive the page with the in-memory mock, whose movie #11 is deliberately
// hostile: null avgRating, null synopsis and no reviews.
vi.mock('../api', async () => {
  const mock = await import('../api/mock')
  const errors = await import('../api/errors')
  return {
    api: mock.mockApi,
    normalizeError: errors.normalizeError,
    USE_MOCK: true,
  }
})

describe('MovieDetailPage', () => {
  it('renders a movie with no rating, synopsis or reviews without crashing', async () => {
    render(
      <MemoryRouter initialEntries={['/movies/11']}>
        <Routes>
          <Route path="/movies/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      await screen.findByText(/The Grand Budapest Hotel/),
    ).toBeInTheDocument()
    expect(screen.getByTitle('Sem avaliações')).toBeInTheDocument()
    expect(screen.getByText('Sinopse não disponível.')).toBeInTheDocument()
    expect(screen.getByText(/Ainda não há reviews/)).toBeInTheDocument()
  })
})
