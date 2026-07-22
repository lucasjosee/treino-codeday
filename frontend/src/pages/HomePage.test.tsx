import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './HomePage'

// Drive the page with the in-memory mock so we exercise the real data flow
// (fetch → grid → cards) without hitting the network.
vi.mock('../api', async () => {
  const mock = await import('../api/mock')
  const errors = await import('../api/errors')
  return {
    api: mock.mockApi,
    normalizeError: errors.normalizeError,
    USE_MOCK: true,
  }
})

describe('HomePage', () => {
  it('renders a grid of movies loaded from the API', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Inception')).toBeInTheDocument()
    expect(await screen.findByText('The Matrix')).toBeInTheDocument()
    // First page holds 12 of the 15 movies.
    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument()
  })
})
