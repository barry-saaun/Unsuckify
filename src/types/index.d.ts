export type ErrorResponse = {
  error: string
  success: false
}

export type SpotifyFetchReturnType<T> = Promise<T | ErrorResponse>

export type ModifiedDataType = {
  album?: string
  artists?: string
  track?: string
}[]
