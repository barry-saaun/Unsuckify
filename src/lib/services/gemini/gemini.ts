import { Context } from "hono"
import { assertError } from "../../utils"
import { RecommendationsRequest } from "./recomendationsRequest"
import { ErrorResponse, ScoredMemberType } from "@/types/index"
import { checkUserBatchLimit } from "../redis/checkUserBatchLimit"
import { redis } from "../redis"

/**
 * add 50 recommended tracks to subsequent batch and returns a success message
 */
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
    ...ScoredMemberList
  )

  return c.json({
    status: "success",
    msg: "Data cached successfully",
    key: redis_recKey,
    insertedCount: result
  })
}
