import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"
import { Context } from "hono"
import { SummarySchema } from "@/constants/geminiResSchema"
import { fetchTracks } from "@/hooks/usePlaylistData"
import {
  convertModifiedDataToString,
  modifiedDataAllTracksPlaylistTrackResponse
} from "../utils"

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || ""

export async function TrackDescriptorSummary(c: Context) {
  try {
    const playlist_id = c.req.param("playlist_id")

    // Ensure playlist_id is valid
    if (!playlist_id) {
      return c.json({ error: "Invalid playlist ID" }, 400)
    }

    const allTracks = await fetchTracks(playlist_id, true)

    if (!allTracks || allTracks.length == 0) {
      return c.json({ error: "No tracks fetched" }, 404)
    }
    const modifiedData = modifiedDataAllTracksPlaylistTrackResponse(allTracks)
    const formattedData = convertModifiedDataToString(modifiedData)

    // const genAI = new GoogleGenerativeAI(API_KEY)
    //
    // const model = genAI.getGenerativeModel({
    //   model: "gemini-1.5-flash",
    //   generationConfig: {
    //     responseMimeType: "application/json",
    //     responseSchema: SummarySchema
    //   }
    // })
    // const prompt = `I have a list of songs formatted as  'Song name - artist name - album name, as the following \n ${allTracks} \n Summarize the overall themes, genres, emotional tones, instrumentation, and rhythm of these songs in a concise format.`

    // const result = await model.generateContent(prompt)
    //
    // const jsonData = JSON.parse(result.response.text())
    //
    // return c.json(jsonData)

    return c.json({ modifiedData })
  } catch (error) {
    console.error("Error in TrackDescriptorSummary:", error)
    return c.json({ error: "Failed to fetch track descriptor summary" }, 500)
  }
}

export async function Recommendations(c: Context) {
  const genAI = new GoogleGenerativeAI(API_KEY)

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: SummarySchema
    }
  })

  const listOfSongs = [""]

  // const songslist_prompt = `I have a list of songs formatted as  'Song name - artist name - album name, as the following \n ${listOfSongs} \n Recommend up to 10 songs that match the vibe, genre, or emotional tone of these tracks. The recommendations should not be limited to the same artists but should focus on similar musical styles, themes, or atmospheres. Provide the output as an array of strings in the format: "Song name - Artist name" `

  const prompt = `I have a list of songs formatted as  'Song name - artist name - album name, as the following \n ${listOfSongs} \n Summarize the overall themes, genres, emotional tones, instrumentation, and rhythm of these songs in a concise format.`

  const result = await model.generateContent(prompt)

  const jsonData = JSON.parse(result.response.text())

  return c.json(jsonData)
}
