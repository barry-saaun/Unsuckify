import { Context } from "hono"
import { spotifyApi } from "./spotify"

type ErrorResponse = {
  ErrMsg: string
}

function isErrorResponse(data: unknown): data is ErrorResponse {
  return typeof data === "object" && data !== null && "ErrMsg" in data
}

export async function serverGetData<T extends object | null>(
  c: Context,
  fetchFn: () => Promise<T | ErrorResponse>
) {
  try {
    const data = await fetchFn()

    if (isErrorResponse(data)) {
      return c.json({ error: data.ErrMsg }, 500)
    }

    return c.json(data)
  } catch (error) {
    return c.json({ error: "An expected error occurred" }, 500)
  }
}
