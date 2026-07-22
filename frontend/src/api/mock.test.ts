import { mockApi } from './mock'

describe('mockApi', () => {
  it('paginates 15 movies into pages of 12', async () => {
    const first = await mockApi.getMovies({ page: 0, size: 12 })
    expect(first.content).toHaveLength(12)
    expect(first.totalElements).toBe(15)
    expect(first.totalPages).toBe(2)
    expect(first.number).toBe(0)

    const second = await mockApi.getMovies({ page: 1, size: 12 })
    expect(second.content).toHaveLength(3)
  })

  it('filters by title (case-insensitive contains)', async () => {
    const result = await mockApi.getMovies({ search: 'the' })
    expect(result.content.length).toBeGreaterThan(0)
    for (const movie of result.content) {
      expect(movie.title.toLowerCase()).toContain('the')
    }
  })

  it('filters by exact genre and lists distinct sorted genres', async () => {
    const genres = await mockApi.getGenres()
    expect(genres).toEqual([...genres].sort())
    expect(new Set(genres).size).toBe(genres.length)

    const sciFi = await mockApi.getMovies({ genre: 'Sci-Fi' })
    expect(sciFi.content.length).toBeGreaterThan(0)
    for (const movie of sciFi.content) {
      expect(movie.genre).toBe('Sci-Fi')
    }
  })

  it('rejects an invalid review with 400 field errors', async () => {
    await expect(
      mockApi.createReview(1, { author: '', rating: 99, comment: '' }),
    ).rejects.toMatchObject({ status: 400 })
  })

  it('rejects reviews for a missing movie with 404', async () => {
    await expect(
      mockApi.createReview(9999, { author: 'X', rating: 5, comment: '' }),
    ).rejects.toMatchObject({ status: 404 })
  })
})
