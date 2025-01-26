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
import { SummarySchema } from "@/constants/geminiResSchema"

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
