import { Context } from "hono"
import { assertError } from "../../utils"
import { RecommendationsRequest } from "./recomendationsRequest"
import { ErrorResponse } from "@/types/index"

export async function Recommendations(c: Context) {
  const recList: string[] | ErrorResponse = await RecommendationsRequest(c)

  if ("error" in recList) {
    return c.json(assertError(recList.error, recList.status))
  }

  console.log(recList.length)

  // TODO: Finalise the implementation
  return c.json(recList)
}
