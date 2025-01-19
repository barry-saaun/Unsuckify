import { SchemaType } from "@google/generative-ai"

export const SummarySchema = {
  description: "Schema, for emotional tones, themes, and genres.",
  type: SchemaType.OBJECT,
  properties: {
    emotional_tones: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
        description: "List of emotional tones."
      }
    },
    themes: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
        description: "List of themes."
      }
    },
    genres: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
        description: "List of genres."
      }
    },
    instrumentation: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
        description: "List of instrumentation."
      }
    },
    rhythm: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
        description: "List of rhythm."
      }
    }
  },
  required: ["emotional_tones", "themes", "genres", "instrumentation", "rhythm"]
}

export const RecommendationsListSchema = {
  description: "Schema for returning a list of recommended songs.",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.STRING,
    description: "One of the recommended songs within the list."
  }
}
