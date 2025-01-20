import { Context } from "hono"
import { ErrorResponse } from "@/types/index"

function isErrorResponse(data: unknown): data is ErrorResponse {
  return typeof data === "object" && data !== null && "error" in data
}

export async function serverGetData<T extends object | null>(
  c: Context,
  fetchFn: () => Promise<T | ErrorResponse>
) {
  try {
    const data = await fetchFn()

    if (isErrorResponse(data)) {
      return c.json({ error: data.error, status: 500, success: false })
    }

    return c.json(data)
  } catch (error) {
    return c.json({
      error: "An expected error occurred",
      status: 500,
      success: false
    })
  }
}
