import { redis } from "../redis"
import { Context } from "hono"
import { assertError } from "@/lib/utils"

export async function redisSetOwnerId(c: Context) {
  if (c.req.method === "POST") {
    const body = await c.req.json()
    const { playlist_id, ownerId } = body

    await redis.hset(`playlist:${playlist_id}:summ`, { ownerId })

    return new Response("OK")
  } else {
    c.header("Allow", "POST")
  }
  return c.json(assertError(`Method ${c.req.method} not allowed`, 405))
}
