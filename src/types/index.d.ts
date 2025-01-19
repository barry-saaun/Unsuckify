export type ErrorResponse = {
  error: string
  success: false
  status?: number
}

export type SpotifyFetchReturnType<T> = Promise<T | ErrorResponse>

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
