// Types mirroring api-contract.md. Kept in sync by hand — the contract is immutable.

export interface MovieSummary {
  id: number
  title: string
  year: number
  genre: string
  posterUrl: string
  avgRating: number
  favorite: boolean
}

export interface MovieDetail extends MovieSummary {
  synopsis: string
  durationMin: number
  director: string
  reviewCount: number
}

export interface Review {
  id: number
  author: string
  rating: number
  comment: string
  createdAt: string
}

// Spring Data `Page` envelope returned by GET /movies.
export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}

export interface MovieQuery {
  page?: number
  size?: number
  search?: string
  genre?: string
}

// Body accepted by POST /movies/{id}/reviews.
export interface NewReview {
  author: string
  rating: number
  comment: string
}

// Standard error body. `errors` is only present on 400 validation failures.
export interface ApiError {
  timestamp: string
  status: number
  message: string
  errors?: Record<string, string>
}

// The surface every backend (real or mock) must implement.
export interface HotflixApi {
  getMovies(query: MovieQuery): Promise<Page<MovieSummary>>
  getMovie(id: number): Promise<MovieDetail>
  getGenres(): Promise<string[]>
  getFavorites(): Promise<MovieSummary[]>
  addFavorite(movieId: number): Promise<void>
  removeFavorite(movieId: number): Promise<void>
  getReviews(movieId: number): Promise<Review[]>
  createReview(movieId: number, review: NewReview): Promise<Review>
}
