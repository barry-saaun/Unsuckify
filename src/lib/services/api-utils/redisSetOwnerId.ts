import { redis } from "../redis"
import { Context } from "hono"
import { assertError } from "@/lib/utils"

export async function redisSetOwnerId(c: Context) {
  if (c.req.method === "POST") {
    const body = await c.req.json()
    const { playlist_id, ownerId } = body

    const key = `playlist:${playlist_id}:summ`

    try {
      const exists = await redis.exists(key)

      if (exists === 0) {
        await redis.json.set(key, "$", { ownerId })
        return new Response("Key was set")
      }

      return new Response("Key already exists")
    } catch (error) {
      console.error("Redis error:", error)
      return c.json(assertError("Internal Server Error", 500))
    }
  } else {
    c.header("Allow", "POST")
  }
  return c.json(assertError(`Method ${c.req.method} not allowed`, 405))
}
