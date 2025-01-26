import { ErrorResponse, TrackDescriptorSummaryResType } from "@/types/index"
import { Context } from "hono"
import { TrackDescriptorSummary } from "./trackDescriptorSummary"
import { assertError } from "@/lib/utils"
import { RecommendationsListSchema } from "@/constants/geminiResSchema"
import { geminiGenerateContent } from "./geminiGenerateContent"
import { geminiRecommendationsPrompt } from "@/constants/geminiPrompts"
import { redis } from "../redis"

export async function RecommendationsRequest(
  c: Context
): Promise<string[] | ErrorResponse> {
  const playlist_id = c.req.param("playlist_id")

  try {
    // check to see if the data exists in redis
    let trackSummary = (await redis.json.get(
      `playlist:${playlist_id}:summ`
    )) as TrackDescriptorSummaryResType | null

    // if not, fetch a new one
    if (!trackSummary) {
      const fetchedSummary = await TrackDescriptorSummary(c)
      if ("error" in fetchedSummary) {
        return assertError(fetchedSummary.error, fetchedSummary.status)
      }

      trackSummary = fetchedSummary
    }

    const recommendationsPrompt = geminiRecommendationsPrompt(trackSummary)

    const recommendationsRes: string[] = await geminiGenerateContent(
      recommendationsPrompt,
      RecommendationsListSchema
    )

    return recommendationsRes
  } catch (error) {
    return assertError("Internal Server Error", 500)
  }
}
