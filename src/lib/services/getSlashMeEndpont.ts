import { Context } from "hono"
import { serverGetData } from "./serverGetData"
import { spotifyApi } from "./spotify"
import { CurrentUsersProfileResponse } from "spotify-api"
import { setCookie } from "hono/cookie"

// this function requests to Get Current User's Profile and append user's id to header
export async function getSlashMeEndpoint(c: Context) {
  const res = await serverGetData(c, spotifyApi.getCurrentUsersProfile)

  if (res.status === 200) {
    const data = (await res.clone().json()) as CurrentUsersProfileResponse

    if (data && typeof data === "object" && "id" in data) {
      const userId = data.id
      setCookie(c, "userId", userId)
      return c.json(data)
    }
  }
}
