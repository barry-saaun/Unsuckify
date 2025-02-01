import { ErrorResponse } from "@/types/index"
import { Context } from "hono"
import { assertError } from "@/lib/utils"
import { RecommendationsListSchema } from "@/schemas/gemini_schema"
import { geminiGenerateContent } from "./geminiGenerateContent"
import {
  geminiRecommendationsPrompt,
  geminiRecommendationsPromptWithOmit
} from "@/constants/geminiPrompts"
import { getTrackSummary } from "../redis/getTrackSummary"

export async function RecommendationsRequest(
  c: Context,
  isFirstBatch: boolean,
  omittedData: string[] | null
): Promise<string[] | ErrorResponse> {
  try {
    const trackSummary = await getTrackSummary(c)

    if (!trackSummary || "error" in trackSummary) {
      return assertError(
        "Track summary could not be retrieved or generated",
        500
      )
    }

    console.log("final summary: ", trackSummary)

    const recommendationsPrompt = isFirstBatch
      ? geminiRecommendationsPrompt(trackSummary)
      : geminiRecommendationsPromptWithOmit(trackSummary, omittedData!)

    const recommendationsRes: string[] = await geminiGenerateContent(
      recommendationsPrompt,
      RecommendationsListSchema
    )

    return recommendationsRes
  } catch (error) {
    throw new Error(
      "[RecommendationsRequest]: cannot fetch the recommendations"
    )
  }
}
