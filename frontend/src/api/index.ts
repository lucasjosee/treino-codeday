import { realApi } from './client'
import { mockApi } from './mock'
import type { HotflixApi } from './types'

// Flip between the in-memory mock and the real backend at build/dev time.
// VITE_USE_MOCK=true → mock; anything else → real API.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const api: HotflixApi = USE_MOCK ? mockApi : realApi

export * from './types'
export { normalizeError, isNotFound, ApiRequestError } from './errors'
export type { NormalizedError } from './errors'
