import { Context } from "hono"
import { assertError } from "../../utils"
import { RecommendationsRequest } from "./recomendationsRequest"

export async function Recommendations(c: Context) {
  const recList = await RecommendationsRequest(c)

  if (!recList || "error" in recList) {
    return c.json(assertError("Recommendations cannot be fetched", 404))
  }

  // const page = parseInt(c.req.query("page") || "1", 10)
  //
  // const paginationRecommendations = await fetchRecommendedItems({
  //   pageParam: 1
  // })

  console.log(recList)
  return c.json(recList)
}
