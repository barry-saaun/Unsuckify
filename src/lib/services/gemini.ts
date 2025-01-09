import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"
import { Context } from "hono"

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || ""

export async function Recommendations(c: Context) {
  const genAI = new GoogleGenerativeAI(API_KEY)

  const schema = {
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
    required: [
      "emotional_tones",
      "themes",
      "genres",
      "instrumentation",
      "rhythm"
    ]
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  })

  const listOfSongs = `["*NSYNC-Bye Bye Bye - From Deadpool and Wolverine Soundtrack-No Strings Attached ","Merrilee Rush & The Turnabouts-Angel of the Morning-Angel Of The Morning ","Stray Kids-SLASH (From “Deadpool & Wolverine”)-SLASH (From “Deadpool & Wolverine”) ","Waylon Jennings-I'm a Ramblin' Man-The Ramblin' Man ","The Platters-Only You - Re-Recorded-Only You (Re-Recorded - Acapella) ","Chris de Burgh-The Lady In Red-Into The Light ","Fergie-Glamorous-Ultimate R&B 2008 (Double Album) ","The Goo Goo Dolls-Iris-Dizzy up the Girl ","Huey Lewis & The News-The Power Of Love-Greatest Hits: Huey Lewis And The News ","Patsy Cline, The Jordanaires-You Belong To Me-Sentimentally Yours ","Avril Lavigne-I'm with You-Let Go ","Eric Carmen-Make Me Lose Control-The Definitive Collection ","Hugh Jackman, Keala Settle, Zac Efron, Zendaya, The Greatest Showman Ensemble-The Greatest Show-The Greatest Show ","John Travolta, Olivia Newton-John-You're The One That I Want - From “Grease”-ドライブが楽しくなる洋楽ヒッツ！80年代 HITS ","Rob Simonsen-LFG - Theme from \"Deadpool & Wolverine\"-Deadpool & Wolverine (Original Motion Picture Soundtrack/Deluxe Edition) ","Jimmy Durante-I'll Be Seeing You-Jimmy' Durante's Way Of Life ","Aretha Franklin-You're All I Need to Get By-30 Greatest Hits ","Green Day-Good Riddance (Time of Your Life)-Nimrod "]`

  // const songslist_prompt = `I have a list of songs formatted as  'Song name - artist name - album name, as the following \n ${listOfSongs} \n Recommend up to 10 songs that match the vibe, genre, or emotional tone of these tracks. The recommendations should not be limited to the same artists but should focus on similar musical styles, themes, or atmospheres. Provide the output as an array of strings in the format: "Song name - Artist name" `

  const prompt = `I have a list of songs formatted as  'Song name - artist name - album name, as the following \n ${listOfSongs} \n Summarize the overall themes, genres, emotional tones, instrumentation, and rhythm of these songs in a concise format.`

  const result = await model.generateContent(prompt)

  const jsonData = JSON.parse(result.response.text())

  return c.json(jsonData)
}
