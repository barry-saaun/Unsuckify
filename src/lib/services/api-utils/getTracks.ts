import { assertError } from "@/lib/utils"
import { Context } from "hono"
import { redis } from "../redis"

/**
 *  /api/getTracks/{id}?batch=number&page=number
 */
export async function getTracks(c: Context) {
  const playlist_id = c.req.param("playlist_id")
  const queryParams = c.req.query()

  console.log("queryParams: ", queryParams)

  if (!("batch" in queryParams && "page" in queryParams)) {
    return c.json(
      assertError(
        "[server][query] 'batch' & 'page' query param cannot be found",
        400
      )
    )
  }

  // appreantly queryParams returns {"route": "getTracks"} as well
  const allowedQueries = ["batch", "route", "page"]

  const queryKeys = Object.keys(queryParams)

  if (queryKeys.some((key) => !allowedQueries.includes(key))) {
    return c.json(
      assertError(
        `[server][query] Invalid query parameter(s): ${queryKeys
          .filter((k) => !allowedQueries.includes(k))
          .join(", ")}`,
        400
      )
    )
  }

  const PAGE_SIZE = 10
  const BATCH_SIZE = 50

  // Extract and validate batch and page params
  const batchCount = parseInt(queryParams.batch, 10)
  const page = parseInt(queryParams.page, 10)

  if (isNaN(batchCount) || isNaN(page) || batchCount <= 0 || page <= 0) {
    return c.json(
      assertError(
        "[server][query] 'batch' and 'page' must be positive numbers",
        400
      )
    )
  }

  const redis_key = `playlist:${playlist_id}:rec:${batchCount}`
  console.log(redis_key)

  const startIdx = (page - 1) * PAGE_SIZE
  const endIdx = startIdx + PAGE_SIZE - 1
  const tracks = await redis.zrange<string[]>(redis_key, startIdx, endIdx)

  const hasMorePage = endIdx < BATCH_SIZE - 1

  // const data = await fetchCachedTracks({ playlist_id, batchCount })
  return c.json({
    tracks,
    hasMoreInCurrentBatch: hasMorePage,
    hasMore: hasMorePage || batchCount < 2,
    nextBatch: batchCount < 2 ? batchCount + 1 : null
  })
}
