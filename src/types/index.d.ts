export type ErrorResponse = {
  error: string
  success: false
}

export type SpotifyFetchReturnType<T> = Promise<T | ErrorResponse>
