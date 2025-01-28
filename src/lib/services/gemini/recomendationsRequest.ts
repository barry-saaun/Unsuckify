import { ErrorResponse, TrackDescriptorSummaryResType } from "@/types/index"
import { Context } from "hono"
import { TrackDescriptorSummary } from "./trackDescriptorSummary"
import { assertError } from "@/lib/utils"
import { RecommendationsListSchema } from "@/schemas/gemini_schema"
import { geminiGenerateContent } from "./geminiGenerateContent"
import { geminiRecommendationsPrompt } from "@/constants/geminiPrompts"
import { redis } from "../redis"

export async function RecommendationsRequest(
  c: Context
): Promise<string[] | ErrorResponse> {
  const playlist_id = c.req.param("playlist_id")

  try {
    const key = `playlist:${playlist_id}:summ`

    const fields = await redis.json.objkeys(key, "$")

    const summaryFieldExists = fields[0]?.includes("summary")

    const ownerIdExists = fields.some(
      (field) => Array.isArray(field) && field.includes("ownerId")
    )
    console.log("ownerId exists", ownerIdExists)

    console.log("summary exists", summaryFieldExists)

    let trackSummary: TrackDescriptorSummaryResType | null = null

    if (summaryFieldExists) {
      const getCachedTrackSummary = await redis.json.get(
        `playlist:${playlist_id}:summ`,
        "$.summary"[0]
      )
      trackSummary = getCachedTrackSummary[0]
    } else {
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

    console.log("summary: ", trackSummary)

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
