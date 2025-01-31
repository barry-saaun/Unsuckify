import { GoogleGenerativeAI, ResponseSchema } from "@google/generative-ai"

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || ""

export async function geminiGenerateContent<T>(
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
