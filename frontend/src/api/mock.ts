import { ApiRequestError } from './errors'
import type {
  HotflixApi,
  MovieDetail,
  MovieQuery,
  MovieSummary,
  NewReview,
  Page,
  Review,
} from './types'

// ---------------------------------------------------------------------------
// In-memory backend used when VITE_USE_MOCK=true. It implements the full
// contract (pagination, filters, favorites, reviews + validation) so the whole
// UI can be exercised before the real backend exists.
// ---------------------------------------------------------------------------

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Generates a self-contained SVG poster so the grid looks right offline.
function poster(title: string, hue: number): string {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>` +
    `<stop offset='0' stop-color='hsl(${hue},48%,30%)'/>` +
    `<stop offset='1' stop-color='hsl(${hue},60%,10%)'/>` +
    `</linearGradient></defs>` +
    `<rect width='300' height='450' fill='url(#g)'/>` +
    `<text x='150' y='240' fill='rgba(255,255,255,0.9)' font-family='sans-serif' ` +
    `font-size='20' font-weight='700' text-anchor='middle'>${escapeXml(title)}</text>` +
    `</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

type MockMovie = MovieDetail

const movies: MockMovie[] = [
  {
    id: 1,
    title: 'Inception',
    year: 2010,
    genre: 'Sci-Fi',
    posterUrl: poster('Inception', 210),
    avgRating: 8.8,
    favorite: true,
    synopsis:
      'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    durationMin: 148,
    director: 'Christopher Nolan',
    reviewCount: 0,
  },
  {
    id: 2,
    title: 'The Shawshank Redemption',
    year: 1994,
    genre: 'Drama',
    posterUrl: poster('The Shawshank Redemption', 30),
    avgRating: 9.3,
    favorite: false,
    synopsis:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    durationMin: 142,
    director: 'Frank Darabont',
    reviewCount: 0,
  },
  {
    id: 3,
    title: 'The Dark Knight',
    year: 2008,
    genre: 'Action',
    posterUrl: poster('The Dark Knight', 260),
    avgRating: 9.0,
    favorite: false,
    synopsis:
      'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests of his ability to fight injustice.',
    durationMin: 152,
    director: 'Christopher Nolan',
    reviewCount: 0,
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    year: 1994,
    genre: 'Crime',
    posterUrl: poster('Pulp Fiction', 350),
    avgRating: 8.9,
    favorite: false,
    synopsis:
      'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    durationMin: 154,
    director: 'Quentin Tarantino',
    reviewCount: 0,
  },
  {
    id: 5,
    title: 'The Matrix',
    year: 1999,
    genre: 'Sci-Fi',
    posterUrl: poster('The Matrix', 140),
    avgRating: 8.7,
    favorite: false,
    synopsis:
      'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    durationMin: 136,
    director: 'The Wachowskis',
    reviewCount: 0,
  },
  {
    id: 6,
    title: 'Interstellar',
    year: 2014,
    genre: 'Sci-Fi',
    posterUrl: poster('Interstellar', 200),
    avgRating: 8.6,
    favorite: false,
    synopsis:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    durationMin: 169,
    director: 'Christopher Nolan',
    reviewCount: 0,
  },
  {
    id: 7,
    title: 'Parasite',
    year: 2019,
    genre: 'Thriller',
    posterUrl: poster('Parasite', 0),
    avgRating: 8.5,
    favorite: true,
    synopsis:
      'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    durationMin: 132,
    director: 'Bong Joon-ho',
    reviewCount: 0,
  },
  {
    id: 8,
    title: 'Spirited Away',
    year: 2001,
    genre: 'Animation',
    posterUrl: poster('Spirited Away', 175),
    avgRating: 8.6,
    favorite: true,
    synopsis:
      'During her family move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.',
    durationMin: 125,
    director: 'Hayao Miyazaki',
    reviewCount: 0,
  },
  {
    id: 9,
    title: 'Whiplash',
    year: 2014,
    genre: 'Drama',
    posterUrl: poster('Whiplash', 45),
    // No reviews yet → null rating; also a favorite, so the Favorites grid
    // must render a null rating too.
    avgRating: null,
    favorite: true,
    synopsis:
      "A promising young drummer enrolls at a cut-throat music conservatory whose dream of greatness is mentored by an instructor who will stop at nothing.",
    durationMin: 106,
    director: 'Damien Chazelle',
    reviewCount: 0,
  },
  {
    id: 10,
    title: 'Mad Max: Fury Road',
    year: 2015,
    genre: 'Action',
    posterUrl: poster('Mad Max: Fury Road', 25),
    avgRating: 8.1,
    favorite: false,
    synopsis:
      'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners.',
    durationMin: 120,
    director: 'George Miller',
    reviewCount: 0,
  },
  {
    id: 11,
    title: 'The Grand Budapest Hotel',
    year: 2014,
    genre: 'Comedy',
    posterUrl: poster('The Grand Budapest Hotel', 320),
    // Maximally hostile record: no rating, no synopsis and no reviews.
    avgRating: null,
    favorite: false,
    synopsis: null,
    durationMin: 99,
    director: 'Wes Anderson',
    reviewCount: 0,
  },
  {
    id: 12,
    title: 'Blade Runner 2049',
    year: 2017,
    genre: 'Sci-Fi',
    posterUrl: poster('Blade Runner 2049', 190),
    avgRating: 8.0,
    favorite: false,
    synopsis:
      "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, missing for thirty years.",
    durationMin: 164,
    director: 'Denis Villeneuve',
    reviewCount: 0,
  },
  {
    id: 13,
    title: 'Get Out',
    year: 2017,
    genre: 'Horror',
    // No poster and no rating → poster fallback + "—" rating must both render.
    posterUrl: null,
    avgRating: null,
    favorite: false,
    synopsis:
      "A young African-American visits his white girlfriend's parents for the weekend, where his uneasiness about their reception eventually reaches a boiling point.",
    durationMin: 104,
    director: 'Jordan Peele',
    reviewCount: 0,
  },
  {
    id: 14,
    title: 'La La Land',
    year: 2016,
    genre: 'Romance',
    posterUrl: poster('La La Land', 220),
    avgRating: 8.0,
    favorite: false,
    synopsis:
      'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
    durationMin: 128,
    director: 'Damien Chazelle',
    reviewCount: 0,
  },
  {
    id: 15,
    title: 'The Godfather',
    year: 1972,
    genre: 'Crime',
    posterUrl: poster('The Godfather', 40),
    avgRating: 9.2,
    favorite: false,
    synopsis:
      'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    durationMin: 175,
    director: 'Francis Ford Coppola',
    reviewCount: 0,
  },
]

// Favorite state lives here so the `favorite` flag stays consistent everywhere.
const favoriteIds = new Set<number>(
  movies.filter((m) => m.favorite).map((m) => m.id),
)

// Seed a few reviews so the detail page isn't empty.
const reviewsByMovie = new Map<number, Review[]>([
  [
    1,
    [
      {
        id: 1,
        author: 'Lucas',
        rating: 9,
        comment: 'Mind-bending and rewatchable. The score is unforgettable.',
        createdAt: '2026-07-20T10:00:00Z',
      },
      {
        id: 2,
        author: 'Marina',
        rating: 8,
        comment: 'Great concept, though the middle act drags a little.',
        createdAt: '2026-07-19T14:30:00Z',
      },
    ],
  ],
  [
    7,
    [
      {
        id: 3,
        author: 'Rafael',
        rating: 10,
        comment: 'A perfect thriller. Every scene earns its place.',
        createdAt: '2026-07-18T09:15:00Z',
      },
    ],
  ],
])

let nextReviewId = 4

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function toSummary(movie: MockMovie): MovieSummary {
  return {
    id: movie.id,
    title: movie.title,
    year: movie.year,
    genre: movie.genre,
    posterUrl: movie.posterUrl,
    avgRating: movie.avgRating,
    favorite: favoriteIds.has(movie.id),
  }
}

function reviewCount(movieId: number): number {
  return reviewsByMovie.get(movieId)?.length ?? 0
}

export const mockApi: HotflixApi = {
  getMovies(query: MovieQuery): Promise<Page<MovieSummary>> {
    const page = query.page ?? 0
    const size = query.size ?? 12
    const search = (query.search ?? '').trim().toLowerCase()
    const genre = (query.genre ?? '').trim()

    let filtered = movies
    if (search) {
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(search),
      )
    }
    if (genre) {
      filtered = filtered.filter((m) => m.genre === genre)
    }

    const totalElements = filtered.length
    const totalPages = Math.max(1, Math.ceil(totalElements / size))
    const start = page * size
    const content = filtered.slice(start, start + size).map(toSummary)

    return delay({ content, totalPages, totalElements, number: page, size })
  },

  getMovie(id: number): Promise<MovieDetail> {
    const movie = movies.find((m) => m.id === id)
    if (!movie) {
      return Promise.reject(notFound('Movie not found'))
    }
    return delay({
      ...movie,
      favorite: favoriteIds.has(movie.id),
      reviewCount: reviewCount(movie.id),
    })
  },

  getGenres(): Promise<string[]> {
    const genres = [...new Set(movies.map((m) => m.genre))].sort()
    return delay(genres)
  },

  getFavorites(): Promise<MovieSummary[]> {
    const favorites = movies
      .filter((m) => favoriteIds.has(m.id))
      .map(toSummary)
    return delay(favorites)
  },

  addFavorite(movieId: number): Promise<void> {
    const movie = movies.find((m) => m.id === movieId)
    if (!movie) {
      return Promise.reject(notFound('Movie not found'))
    }
    favoriteIds.add(movieId) // idempotent
    return delay(undefined)
  },

  removeFavorite(movieId: number): Promise<void> {
    favoriteIds.delete(movieId) // idempotent, always 204
    return delay(undefined)
  },

  getReviews(movieId: number): Promise<Review[]> {
    if (!movies.some((m) => m.id === movieId)) {
      return Promise.reject(notFound('Movie not found'))
    }
    const list = [...(reviewsByMovie.get(movieId) ?? [])].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    )
    return delay(list)
  },

  createReview(movieId: number, review: NewReview): Promise<Review> {
    if (!movies.some((m) => m.id === movieId)) {
      return Promise.reject(notFound('Movie not found'))
    }

    const errors = validateReview(review)
    if (Object.keys(errors).length > 0) {
      return Promise.reject(
        new ApiRequestError({
          timestamp: new Date().toISOString(),
          status: 400,
          message: 'Validation failed',
          errors,
        }),
      )
    }

    const created: Review = {
      id: nextReviewId++,
      author: review.author.trim(),
      rating: review.rating,
      comment: review.comment.trim(),
      createdAt: new Date().toISOString(),
    }
    const existing = reviewsByMovie.get(movieId) ?? []
    reviewsByMovie.set(movieId, [created, ...existing])
    return delay(created)
  },
}

function notFound(message: string): ApiRequestError {
  return new ApiRequestError({
    timestamp: new Date().toISOString(),
    status: 404,
    message,
  })
}

function validateReview(review: NewReview): Record<string, string> {
  const errors: Record<string, string> = {}
  const author = (review.author ?? '').trim()
  if (author.length < 1 || author.length > 60) {
    errors.author = 'Author must be between 1 and 60 characters'
  }
  if (
    !Number.isInteger(review.rating) ||
    review.rating < 1 ||
    review.rating > 10
  ) {
    errors.rating = 'Rating must be an integer between 1 and 10'
  }
  if ((review.comment ?? '').length > 500) {
    errors.comment = 'Comment must be at most 500 characters'
  }
  return errors
}
