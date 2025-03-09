import { Context } from "hono"
import { SpotifyFetchResponse } from "@/types/index"
import { serverGetData } from "./serverGetData"
import { assertError } from "../../utils"

async function getApiDataWithParamAndQuery<T extends object | null>(
  c: Context,
  fetchFn: (
    paramName: string,
    queryKeysValues: Record<string, string | number>
  ) => Promise<SpotifyFetchResponse<T>>,
  paramName: string,
  queryKeys: string[]
) {
  return serverGetData(c, async () => {
    const queryParamsValues = queryKeys.reduce<Record<string, string | number>>(
      (acc, key) => {
        const value = c.req.query(key)
        if (value !== undefined) {
          const numericValue = Number(value)
          acc[key] = isNaN(numericValue) ? value : numericValue
        }
        return acc
      },
      {}
    )

    const data = await fetchFn(c.req.param(paramName), queryParamsValues)
    if (data && "success" in data && data.success === false) {
      // Transform the error response for `serverGetData`
      return assertError(data.error, data.status)
    }

    return data
  })
}

export default getApiDataWithParamAndQuery
