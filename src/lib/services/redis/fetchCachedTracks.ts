import axios from "axios"
import { redis } from "."

export async function fetchCachedTracks({
  playlist_id,
  batchCount
}: {
  playlist_id: string
  batchCount: number
}) {
  const redis_recKey = `playlist:${playlist_id}:rec:${batchCount}`

  console.log("[fetchCachedTracks]:", redis_recKey)

  try {
    // hit the endpoint for inserting subsequent batch to redis, i.e., first and second
    await axios.get(`http://localhost:3000/api/recommendations/${playlist_id}`)
    console.log(`[query]: success GET request "recommendations" endpoint`)

    const tracks = await redis.zrange<string[]>(redis_recKey, 0, -1)
    return tracks
  } catch (error) {
    console.error("[fetchTracks]:", error)
    return []
  }
}
