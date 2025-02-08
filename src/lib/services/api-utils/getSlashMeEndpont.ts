import { Context } from "hono"
import { serverGetData } from "./serverGetData"
import { spotifyApi } from "../spotify"
import { CurrentUsersProfileResponse } from "spotify-api"
import { cookies } from "next/headers"

// this function requests to Get Current User's Profile and append user's id to header
export async function getSlashMeEndpoint(c: Context) {
  const res = await serverGetData(c, spotifyApi.getCurrentUsersProfile)

  console.log("getSlashMeEndpoint status: ", res.status)
  const jsonData = await res.json()

  if ("error" in res || res.status !== 200) {
    throw new Error("[/me]: error in fetching data")
  }
  const data = jsonData as CurrentUsersProfileResponse

  const userId = data.id

  const cookieStore = await cookies()

  cookieStore.set("userId", userId, {
    httpOnly: true,
    secure: true,
    maxAge: 3600
  })

  return c.json(data)
}
