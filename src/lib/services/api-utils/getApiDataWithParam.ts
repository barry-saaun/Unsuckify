import { Context } from "hono"
import { SpotifyFetchResponse } from "@/types/index"
import { serverGetData } from "./serverGetData"
import { assertError } from "../../utils"

async function getApiDataWithParam<T extends object | null>(
  c: Context,
  fetchFn: (param: string) => Promise<SpotifyFetchResponse<T>>,
  paramName: string
) {
  return serverGetData(c, async () => {
    const data = await fetchFn(c.req.param(paramName))
    if (data && "success" in data && data.success === false) {
      // Transform the error response for `serverGetData`
      return assertError(data.error, data.status)
    }

    return data
  })
}

export default getApiDataWithParam
