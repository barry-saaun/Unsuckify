import { Context } from "hono"
import { SpotifyFetchReturnType } from "./spotify"
import { serverGetData } from "./serverGetData"

async function getApiDataWithParam<T extends object | null>(
  c: Context,
  fetchFn: (param: string) => SpotifyFetchReturnType<T>,
  paramName: string
) {
  return serverGetData(c, async () => {
    const data = await fetchFn(c.req.param(paramName))
    if (data && "success" in data && data.success === false) {
      // Transform the error response for `serverGetData`
      return { error: data.error }
    }

    return data
  })
}

export default getApiDataWithParam
