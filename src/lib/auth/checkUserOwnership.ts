import { cookies } from "next/headers"
import { redis } from "../services/redis"

export const checkUserOwnerShip = async (
  playlist_id: string
): Promise<boolean> => {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  if (!userId) {
    throw new Error("[checkUserOwnership]: No userId found in cookies")
  }

  const redisOwnerIdKey = `playlist:${playlist_id}:summ`

  try {
    const playlistOwnerId = await redis.json.get<string[]>(
      redisOwnerIdKey,
      "$.ownerId"
    )

    if (!playlistOwnerId || playlistOwnerId.length === 0) {
      throw new Error(
        `[checkUserOwnerShip]: playlist's ownerId cannot be found`
      )
    }

    return userId === playlistOwnerId[0]
  } catch (error) {
    console.error(
      "[checkUserOwnerShip]: error fetching ownerId from redis:",
      error
    )

    return false
  }
}
