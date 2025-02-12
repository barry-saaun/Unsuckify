import { QueryFunctionContext } from "@tanstack/react-query"
import { redis } from "../redis"
import axios from "axios"
import { QueryKeyObjectType } from "@/types/index"

const LIMIT = 10

export const getTracks = async ({
  playlist_id,
  batchCount
}: QueryKeyObjectType): Promise<string[]> => {
  const redis_recKey = `playlist:${playlist_id}:rec:${batchCount}`
  console.log(redis_recKey)

  try {
    await axios.get(`http://localhost:3000/api/recommendations/${playlist_id}`)
    console.log(`[query]: success GET request "recommendations" endpoint`)

    const tracks = await redis.zrange<string[]>(redis_recKey, 0, -1)
    return tracks
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return []
  }
}

export async function fetchRecommendedTracks(
  context: QueryFunctionContext<readonly [string, QueryKeyObjectType], number>
) {
  const [_key, { playlist_id, batchCount }] = context.queryKey

  const pageParam = context.pageParam ?? 0

  const tracks = await getTracks({ playlist_id, batchCount })
  console.log("[infinite query]: ", tracks)

  if (!tracks) throw new Error("[infiniteQuery]: tracks can be queried")

  return {
    data: tracks.slice(pageParam, pageParam + LIMIT),
    currentPage: pageParam,
    nextPage: pageParam + LIMIT < tracks.length ? pageParam + LIMIT : null,

    // if the items from the batch has been fetched for more than 60%,
    // it's ready for a new batch
    isReadyForNextBatch: pageParam / tracks.length > 0.6
  }
}
