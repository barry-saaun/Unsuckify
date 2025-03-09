export type ErrorResponse = {
  error: string
  status: number
  success: boolean
}

export type SpotifyFetchResponse<T> = T | ErrorResponse

export type SpotifyPostResponse<T> = T | ErrorResponse

export type PostRequestBody = Record<
  string,
  string | string[] | boolean | number
>

export type BreakpointValues = {
  DEFAULT: string
  SM: string
  MD: string
  LG: string
}

export type OffsetLimitParams = {
  offset: string | number
  limit: string | number
}

export type ModifiedDataType = {
  album?: string
  artists?: string
  track?: string
}[]

export type TrackDescriptorSummaryResType = Record<
  "emotional_tones" | "genres" | "instrumentation" | "rhythm" | "themes",
  string[]
>

export type PaginatedQueryKeyType = [string, { playlist_id: string }]

export type ScoredMemberType = {
  score: number
  member: string
}

export type PaginatedRecommendationsType = {
  data: string[]
  currentPage: number
  nextPage: number | null
  total: number
}

export type GetTracksReturnType = {
  tracks: string[]
  hasMore: boolean
  hasMoreInCurrentBatch: boolean
  nextBatch: number | null
}
