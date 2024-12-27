export type ErrorResponse = {
  error: string
  success: false
}

export type SpotifyFetchReturnType<T> = Promise<T | ErrorResponse>

export type ModifiedDataType = {
  artists?: string
  album?: string
  track?: string
}[]
