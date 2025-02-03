import { Context } from "hono"
import { assertError } from "../../utils"
import { RecommendationsRequest } from "./recomendationsRequest"
import { ErrorResponse } from "@/types/index"
import { checkUserBatchLimit } from "../redis/checkUserBatchLimit"
import { redis } from "../redis"
import { getCookie } from "hono/cookie"

type ScoredMemberType = {
  score: number
  member: string
}

export async function Recommendations(c: Context) {
  const playlist_id = c.req.param("playlist_id")

  const { canRequest, batchCount } = await checkUserBatchLimit(c, playlist_id)

  if (!canRequest) {
    return c.json(
      assertError(
        "You've reached your daily limit for this playlist (100 recommendations)",
        429
      )
    )
  }

  const isFirstBatch = batchCount === 1

  let omittedData: string[] | null = null

  if (!isFirstBatch) {
    const redisFirstBatchKey = `playlist:${playlist_id}:rec:1`
    omittedData = (await redis.zrange(redisFirstBatchKey, 0, -1)) as string[]
  }

  const newRecommendation: string[] | ErrorResponse =
    await RecommendationsRequest(c, isFirstBatch, omittedData)

  if ("error" in newRecommendation) {
    return c.json(
      assertError(newRecommendation.error, newRecommendation.status)
    )
  }

  const ScoredMemberList: ScoredMemberType[] = newRecommendation.map(
    (item, i) => ({
      score: Date.now() + i,
      member: item
    })
  )

  const redis_recKey = `playlist:${playlist_id}:rec:${batchCount}`

  const result = await redis.zadd(
    redis_recKey,
    ScoredMemberList[0],
    ...ScoredMemberList.slice(1, -2)
    // -2 to omit the annoying response from Gemini that includes the placeholder which is appended
    // at the last index
  )

  // for the love of baby J, why is gemini is so annoying to use, it keeps on generating placeholder data
  // reuslt === 1, means the data is "Song name - Artist name - Album name"
  if (result === 1) {
    console.log("[gemini]: placeholder data was placed")
    const userId = getCookie(c, "userId") ?? undefined

    if (!userId) {
      throw new Error("User id not found")
    }

    const batchKey = `user:${userId}:batchCounts`
    await redis.json.set(
      batchKey,
      `$.${playlist_id}.batchCount`,
      batchCount - 1
    )
  }

  return c.json({
    status: "success",
    msg: "Data cached successfully",
    key: redis_recKey,
    insertedCount: result
  })
}
