import { TrackDescriptorSummaryResType } from "@/types/index"

export const geminiSummaryPrompt = (formattedData: string[]): string =>
  `I have a list of songs formatted as  'Song name - artist name - album name, as the following \n ${formattedData} \n Summarize the overall themes, genres, emotional tones, instrumentation, and rhythm of these songs in a concise format.`

export const geminiRecommendationsPrompt = (
  trackDescriptorSummary: TrackDescriptorSummaryResType
): string => `Based on the following input:
${JSON.stringify(trackDescriptorSummary, null, 2)}

Provide 50 songs that match the emotional tones, genres, instrumentation, rhythm, and themes. Ensure that:
1. Each song is real, and the song name, artist name, and album name are accurately matched.
2. Format each entry as a string using **exactly** this pattern:
   "Song name - Artist name - Album name".
   Do not include any additional text, headers, or examples (e.g., "Song Name - Artist Name - Album Name").
3. If uncertain about the exact album or artist for a song, include only songs where all details can be confirmed. Do not leave gaps or return fewer than 50 songs. 
4. If the input constraints limit the pool of possible songs, expand the scope slightly within reason to ensure a total of 50 entries.
5. Double-check for accuracy to ensure all songs, artists, and albums are properly matched.
6. The response must contain exactly 50 entries. Do not add any extra text before or after the list.

Return only the formatted list of 50 songs.
`

export const geminiRecommendationsPromptWithOmit = (
  trackDescriptorSummary: TrackDescriptorSummaryResType,
  omittedData: string[]
) =>
  `${geminiRecommendationsPrompt(trackDescriptorSummary)} by omitting the following songs: \n ${JSON.stringify(omittedData, null, 2)} `
