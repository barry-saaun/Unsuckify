export type ErrorResponse = {
  error: string
  success: false
}

export type SpotifyFetchReturnType<T> = Promise<T | ErrorResponse>

export type OffsetLimitParams = {
  offset: string | number
  limit: string | number
}

export type ModifiedDataType = {
  album?: string
  artists?: string
  track?: string
}[]
