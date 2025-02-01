import { Context } from "hono"
import { getCookie } from "hono/cookie"
import { redis } from "."

export async function checkUserBatchLimit(
  c: Context,
  playlist_id: string
): Promise<{ canRequest: boolean; batchCount: number }> {
  const userId = getCookie(c, "userId") ?? undefined

  if (!userId) {
    throw new Error("User id not found")
  }

  const batchKey = `user:${userId}:batchCounts`

  const batchCountRaw = (await redis.hget(batchKey, playlist_id)) as
    | string
    | null

  const batchCount = batchCountRaw ? parseInt(batchCountRaw, 10) : 1

  if (batchCount > 2) return { canRequest: false, batchCount }

  await Promise.all([
    redis.hincrby(batchKey, playlist_id, 1),
    redis.expire(batchKey, 60 * 60 * 24)
  ])

  return { canRequest: true, batchCount }
}
