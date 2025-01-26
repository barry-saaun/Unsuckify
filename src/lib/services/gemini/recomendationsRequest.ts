import { ErrorResponse } from "@/types/index"
import { Context } from "hono"
import { TrackDescriptorSummary } from "./trackDescriptorSummary"
import { assertError } from "@/lib/utils"
import { RecommendationsListSchema } from "@/constants/geminiResSchema"
import { geminiGenerateContent } from "./geminiGenerateContent"
import { geminiRecommendationsPrompt } from "@/constants/geminiPrompts"

export async function RecommendationsRequest(
  c: Context
): Promise<string[] | ErrorResponse> {
  const trackSummary = await TrackDescriptorSummary(c)

  if (!trackSummary || "error" in trackSummary) {
    return assertError(trackSummary.error, trackSummary.status)
  }
  console.log(trackSummary)

  const recommendationsPrompt = geminiRecommendationsPrompt(trackSummary)

  const recommendationsRes: string[] = await geminiGenerateContent(
    recommendationsPrompt,
    RecommendationsListSchema
  )
  console.log(recommendationsRes)

  return recommendationsRes
}
