import axios from 'axios'
import type {
  HotflixApi,
  MovieDetail,
  MovieQuery,
  MovieSummary,
  NewReview,
  Page,
  Review,
} from './types'

const baseURL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

// Single axios instance shared by every request against the real backend.
export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Real implementation of the contract, backed by the Spring backend.
export const realApi: HotflixApi = {
  async getMovies(query: MovieQuery): Promise<Page<MovieSummary>> {
    const { page = 0, size = 12, search, genre } = query
    const { data } = await http.get<Page<MovieSummary>>('/movies', {
      params: {
        page,
        size,
        // Send only when set so we don't filter on empty strings.
        search: search || undefined,
        genre: genre || undefined,
      },
    })
    return data
  },

  async getMovie(id: number): Promise<MovieDetail> {
    const { data } = await http.get<MovieDetail>(`/movies/${id}`)
    return data
  },

  async getGenres(): Promise<string[]> {
    const { data } = await http.get<string[]>('/genres')
    return data
  },

  async getFavorites(): Promise<MovieSummary[]> {
    const { data } = await http.get<MovieSummary[]>('/favorites')
    return data
  },

  async addFavorite(movieId: number): Promise<void> {
    await http.post(`/favorites/${movieId}`)
  },

  async removeFavorite(movieId: number): Promise<void> {
    await http.delete(`/favorites/${movieId}`)
  },

  async getReviews(movieId: number): Promise<Review[]> {
    const { data } = await http.get<Review[]>(`/movies/${movieId}/reviews`)
    return data
  },

  async createReview(movieId: number, review: NewReview): Promise<Review> {
    const { data } = await http.post<Review>(
      `/movies/${movieId}/reviews`,
      review,
    )
    return data
  },
}
