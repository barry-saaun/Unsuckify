import { z } from "zod"

export const RedisSummarySchema = z.object({
  instrumentation: z
    .array(z.string())
    .describe("List of instruments used in the music."),
  rhythm: z
    .array(z.string())
    .describe("List of rhythm or tempo descriptors for the music."),
  themes: z
    .array(z.string())
    .describe("List of themes or topics explored in the music."),
  emotional_tones: z
    .array(z.string())
    .describe("List of emotional tones or moods conveyed by the music."),
  genres: z
    .array(z.string())
    .describe("List of genres associated with the music.")
})

export const RedisSummaryKey = z.object({
  summary: RedisSummarySchema,
  ownerId: z.string()
})

export const RedisPlaylistBatchCount_TimeStamp = z.object({
  batchCount: z.number(),
  createdAt: z.number()
})
