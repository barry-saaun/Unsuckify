import { PaginatedQueryKeyType } from "@/types/index"
import { QueryFunctionContext } from "@tanstack/react-query"
import axios from "axios"

const LIMIT = 10

type FetchPaginatedRecommendedTracksParams = {
  context: QueryFunctionContext<PaginatedQueryKeyType, number>
  batchCount: number
}

/**
 * batchCount as a param, not queryKey, to avoid refetching when
 * incremented
 */
export async function fetchPaginatedRecommendedTracks({
  batchCount,
  context
}: FetchPaginatedRecommendedTracksParams) {
  const [_key, { playlist_id }] = context.queryKey

  const pageParam = context.pageParam ?? 0

  const { data: tracks } = await axios.get<string[]>(
    `/api/getTracks/${playlist_id}?batch=${batchCount}`
  )
  console.log(`inf query batchCount: `, batchCount)

  if (!tracks) throw new Error("[infiniteQuery]: tracks can be queried")

  return {
    data: tracks.slice(pageParam, pageParam + LIMIT),
    currentPage: pageParam,
    nextPage: pageParam + LIMIT < tracks.length ? pageParam + LIMIT : null,

    // if the items from the batch has been fetched for more than 70%,
    // it's ready for a new batch
    isReadyForNextBatch: pageParam / tracks.length > 0.7
  }
}
