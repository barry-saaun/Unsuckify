import { ErrorResponse, TrackDescriptorSummaryResType } from "@/types/index"
import { Context } from "hono"
import { TrackDescriptorSummary } from "./trackDescriptorSummary"
import { assertError } from "@/lib/utils"
import { RecommendationsListSchema } from "@/schemas/gemini_schema"
import { geminiGenerateContent } from "./geminiGenerateContent"
import { geminiRecommendationsPrompt } from "@/constants/geminiPrompts"
import { redis } from "../redis"
import { RedisSummarySchema } from "@/schemas/redis_schema"

export async function RecommendationsRequest(
  c: Context
): Promise<string[] | ErrorResponse> {
  const playlist_id = c.req.param("playlist_id")

  try {
    const key = `playlist:${playlist_id}:summ`

    const fields = await redis.json.objkeys(key, "$")

    const summaryFieldExists = fields[0]?.includes("summary")

    let trackSummary: TrackDescriptorSummaryResType | null = null

    // if the data exist in the DB, fetch the cached data
    if (summaryFieldExists) {
      console.log("fetched from redis")

      const getCachedTrackSummary = (await redis.json.get(
        `playlist:${playlist_id}:summ`,
        "$.summary"
      )) as Array<TrackDescriptorSummaryResType>

      console.log("cached track summary raw:", getCachedTrackSummary)

      const parsedResult = RedisSummarySchema.safeParse(
        getCachedTrackSummary[0]
      )

      // zod schema validation
      if (parsedResult.success) {
        trackSummary = parsedResult.data
      }
      // zod error check
      else {
        console.error("Zod validation failed:", parsedResult.error)
        return assertError("Invalid  cache track summary format", 500)
      }

      trackSummary = getCachedTrackSummary[0]
    }

    // if not fetch from the API
    else {
      console.log("newly fetched from API")

      const fetchedSummary = await TrackDescriptorSummary(c)
      if ("error" in fetchedSummary) {
        return assertError(fetchedSummary.error, fetchedSummary.status)
      }
      trackSummary = fetchedSummary
    }

    if (!trackSummary) {
      return assertError(
        "Track summary could not be retrieved or generated",
        500
      )
    }

    console.log("final summary: ", trackSummary)

    const recommendationsPrompt = geminiRecommendationsPrompt(trackSummary)

    const recommendationsRes: string[] = await geminiGenerateContent(
      recommendationsPrompt,
      RecommendationsListSchema
    )

    return recommendationsRes
  } catch (error) {
    return assertError("Internal Server Error in Requesting", 500)
  }
}
