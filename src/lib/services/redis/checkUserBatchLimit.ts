import { Context } from "hono"
import { getCookie } from "hono/cookie"
import { redis } from "."
import { RedisPlaylistBatchCount_TimeStamp } from "@/schemas/redis_schema"
import { z } from "zod"

type RedisPlaylistBatchCountType = z.infer<
  typeof RedisPlaylistBatchCount_TimeStamp
>

export async function checkUserBatchLimit(
  c: Context,
  playlist_id: string
): Promise<{ canRequest: boolean; batchCount: number }> {
  const userId = getCookie(c, "userId") ?? undefined

  if (!userId) {
    throw new Error("User id not found")
  }

  const batchKey = `user:${userId}:batchCounts`

  const existingDataArray = await redis.json.get<
    Record<string, RedisPlaylistBatchCountType>[]
  >(batchKey, `$`)

  const existingData = existingDataArray?.[0] || {}

  console.log("[checkUserBatchLimit]: existingData in key", existingDataArray)

  const PlaylistKV = await redis.json.get<Array<RedisPlaylistBatchCountType>>(
    batchKey,
    `$.${playlist_id}`
  )

  if (!PlaylistKV?.length) {
    const batchCount = 1

    await redis.json.set(
      batchKey,
      "$",
      JSON.stringify({
        ...existingData,
        [playlist_id]: {
          batchCount,
          createdAt: Date.now()
        }
      })
    )

    return { canRequest: true, batchCount }
  }

  const { batchCount, createdAt } = PlaylistKV[0]

  if (batchCount >= 2) return { canRequest: false, batchCount }

  const now = Date.now()

  // check if it has been 24 hours since the field was created
  const isExpired = now - createdAt >= 86_400_000 // 24 * 60 * 60 * 1000

  if (isExpired) {
    // delete that specific playlist_id field, i.e. after 24 hours, user
    // can reqest new batches
    await redis.json.del(batchKey, `$.${playlist_id}`)
  }

  await redis.json.set(batchKey, `$.${playlist_id}.batchCount`, batchCount + 1)

  return { canRequest: true, batchCount: batchCount + 1 }
}
