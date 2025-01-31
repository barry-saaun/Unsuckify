import { geminiSummaryPrompt } from "@/constants/geminiPrompts"
import { fetchTracks } from "@/hooks/usePlaylistData"
import {
  assertError,
  convertModifiedDataToString,
  modifiedDataAllTracksPlaylistTrackResponse
} from "@/lib/utils"
import { ErrorResponse, TrackDescriptorSummaryResType } from "@/types/index"
import { Context } from "hono"
import { geminiGenerateContent } from "./geminiGenerateContent"
import { GeminiSummarySchema } from "@/schemas/gemini_schema"
import { redis } from "../redis"

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
      await geminiGenerateContent(summaryPrompt, GeminiSummarySchema)

    const redisKey = `playlist:${playlist_id}:summ`

    const existingData: any = await redis.json.get(redisKey, "$")

    const ownerId = existingData ? existingData[0]?.ownerId : null

    const fullData = {
      ownerId,
      summary: trackSummaryRes
    }

    console.log(fullData)

    await redis.json.set(redisKey, "$", fullData)

    return trackSummaryRes
  } catch (error) {
    return assertError("Failed to fetch track descriptor summary", 500)
  }
}
