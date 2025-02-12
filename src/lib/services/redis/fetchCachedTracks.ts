import axios from "axios"
import { redis } from "."
import { QueryKeyObjectType } from "@/types/index"

export async function fetchCachedTracks({
  playlist_id,
  batchCount
}: QueryKeyObjectType) {
  const redis_recKey = `playlist:${playlist_id}:rec:${batchCount}`

  console.log("[fetchCachedTracks]:", redis_recKey)

  try {
    const _ = await axios.get(
      `http://localhost:3000/api/recommendations/${playlist_id}`
    )

    const tracks = await redis.zrange<string[]>(redis_recKey, 0, -1)
    return tracks
  } catch (error) {
    console.error("[fetchTracks]:", error)
  }
}
