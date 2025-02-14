import { Context } from "hono"
import { redis } from "."
import { TrackDescriptorSummaryResType } from "@/types/index"
import { RedisSummarySchema } from "@/schemas/redis_schema"
import { assertError } from "@/lib/utils"
import { TrackDescriptorSummary } from "../gemini/trackDescriptorSummary"

export async function getTrackSummary(c: Context) {
  try {
    const playlist_id = c.req.param("playlist_id")

    const key = `playlist:${playlist_id}:summ`

    const getCachedTrackSummary = (await redis.json.get(
      key,
      "$.summary"
    )) as Array<TrackDescriptorSummaryResType>

    console.log("cached summary: ", getCachedTrackSummary)

    if (getCachedTrackSummary && getCachedTrackSummary.length > 0) {
      console.log("fetched from redis")

      const parsedResult = RedisSummarySchema.safeParse(
        getCachedTrackSummary[0]
      )
      if (!parsedResult.success) {
        console.error("Zod validation failed", parsedResult.error)
        return assertError("Invalid cahce format", 500)
      }

      return parsedResult.data
    }

    // fetch new track summary if caching data does not exist
    console.log("Fetched from API")

    const fetchedSummary = await TrackDescriptorSummary(c)
    if ("error" in fetchedSummary) {
      return assertError(fetchedSummary.error, fetchedSummary.status)
    }

    return fetchedSummary
  } catch (error) {
    throw new Error("[redis][trackSummary]: cannot fetch/found track summary")
  }
}
