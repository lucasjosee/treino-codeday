import axios from 'axios'
import type { ApiError } from './types'

// A single normalized error shape the UI can branch on, whether the failure
// came from a real axios request or from the in-memory mock.
export interface NormalizedError {
  status?: number
  message: string
  fieldErrors?: Record<string, string>
  isNetwork: boolean
}

// Thrown by the mock backend to mimic a non-2xx HTTP response.
export class ApiRequestError extends Error {
  status: number
  body: ApiError

  constructor(body: ApiError) {
    super(body.message)
    this.name = 'ApiRequestError'
    this.status = body.status
    this.body = body
  }
}

export function normalizeError(err: unknown): NormalizedError {
  if (err instanceof ApiRequestError) {
    return {
      status: err.status,
      message: err.message,
      fieldErrors: err.body.errors,
      isNetwork: false,
    }
  }

  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiError | undefined
    if (err.response) {
      return {
        status: err.response.status,
        message: data?.message ?? err.message,
        fieldErrors: data?.errors,
        isNetwork: false,
      }
    }
    // Request made but no response → server unreachable / network failure.
    return {
      message: 'Não foi possível conectar ao servidor.',
      isNetwork: true,
    }
  }

  if (err instanceof Error) {
    return { message: err.message, isNetwork: false }
  }

  return { message: 'Ocorreu um erro inesperado.', isNetwork: false }
}

export function isNotFound(err: unknown): boolean {
  return normalizeError(err).status === 404
}
