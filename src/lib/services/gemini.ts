import { GoogleGenerativeAI } from "@google/generative-ai"
import { Context } from "hono"
import {
  RecommendationsListSchema,
  SummarySchema
} from "@/constants/geminiResSchema"
import { fetchTracks } from "@/hooks/usePlaylistData"
import {
  assertError,
  convertModifiedDataToString,
  modifiedDataAllTracksPlaylistTrackResponse
} from "../utils"
import { ResponseSchema } from "@google/generative-ai"
import { ErrorResponse, TrackDescriptorSummaryResType } from "@/types/index"
import {
  geminiRecommendationsPrompt,
  geminiSummaryPrompt
} from "@/constants/geminiPrompts"

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || ""

async function geminiGenerateContent<T>(
  prompt: string,
  responseSchema: ResponseSchema
): Promise<T> {
  const genAI = new GoogleGenerativeAI(API_KEY)

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema
    }
  })

  const result = await model.generateContent(prompt)

  const jsonData = JSON.parse(result.response.text())

  return jsonData as T
}

export async function TrackDescriptorSummary(
  c: Context
): Promise<TrackDescriptorSummaryResType | ErrorResponse> {
  try {
    const playlist_id = c.req.param("playlist_id")

    // Ensure playlist_id is valid
    if (!playlist_id) {
      return assertError("Invalid playlist ID", 400)
    }

    const allTracks = await fetchTracks(playlist_id, true)

    if (!allTracks || allTracks.length == 0) {
      return assertError("No tracks fetched", 404)
    }
    const modifiedData = modifiedDataAllTracksPlaylistTrackResponse(allTracks)
    const formattedData = convertModifiedDataToString(modifiedData)

    const summaryPrompt = geminiSummaryPrompt(formattedData)

    const trackSummaryRes: TrackDescriptorSummaryResType =
      await geminiGenerateContent(summaryPrompt, SummarySchema)

    return trackSummaryRes
  } catch (error) {
    return assertError("Failed to fetch track descriptor summary", 500)
  }
}

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

export async function Recommendations(c: Context) {
  const res = await RecommendationsRequest(c)

  if (!res) {
    return c.json({
      error: "Recommendations cannot be fetch",
      status: 404,
      success: false
    })
  }

  const page = parseInt(c.req.query("page") || "1", 10)
  const pageSize = 10
  // const pageIdx =
}
