import { Context } from "hono"
import { serverGetData } from "./serverGetData"
import { spotifyApi } from "./spotify"
import { CurrentUsersProfileResponse } from "spotify-api"
import { setCookie } from "hono/cookie"
import { cookies } from "next/headers"

// this function requests to Get Current User's Profile and append user's id to header
export async function getSlashMeEndpoint(c: Context) {
  const res = await serverGetData(c, spotifyApi.getCurrentUsersProfile)

  const cookieStore = await cookies()

  if (res.status === 200) {
    const data = (await res.clone().json()) as CurrentUsersProfileResponse

    if (data && typeof data === "object" && "id" in data) {
      const userId = data.id
      const expires_in = cookieStore.get("expires_in")?.value

      if (expires_in) {
        setCookie(c, "userId", userId, {
          expires: new Date(parseInt(expires_in))
        })
      }

      return c.json(data)
    }
  }
}
