import { TrackDescriptorSummaryResType } from "@/types/index"

export const geminiSummaryPrompt = (formattedData: string[]): string =>
  `I have a list of songs formatted as  'Song name - artist name - album name, as the following \n ${formattedData} \n Summarize the overall themes, genres, emotional tones, instrumentation, and rhythm of these songs in a concise format.`

export const geminiRecommendationsPrompt = (
  trackDescriptorSummary: TrackDescriptorSummaryResType | string
): string => `Based on the following input:
${JSON.stringify(trackDescriptorSummary, null, 2)}

Provide 10 songs that match the emotional tones, genres, instrumentation, rhythm, and themes. Ensure that:
1. Each song is real, and the song name, artist name, and album name are correctly matched.
2. The response is a list of 10 strings formatted as:
   "Song name - Artist name - Album name".
3. If unsure about the exact album or artist, do not guess. Instead, omit that entry.

Double-check for accuracy to avoid mixing up data (e.g., assigning the wrong album to a song).`
