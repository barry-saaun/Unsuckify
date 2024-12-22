import { getAuthEndpointUrl, getOAuthCode } from "@/lib/auth/getAuthCode"
import { logout } from "@/lib/auth/utils"
import getApiDataWithParam from "@/lib/services/getApiDataWithParam"
import { serverGetData } from "@/lib/services/serverGetData"
import { spotifyApi } from "@/lib/services/spotify"
import { Hono } from "hono"
import { handle } from "hono/vercel"

export const runtime = "edge"

const app = new Hono().basePath("/api")

app.get("/search", (c) => {
  return c.json({ msg: "hello world" })
})

app.get("/login", getAuthEndpointUrl)

app.get("/callback", getOAuthCode)

app.get("/me", (c) => serverGetData(c, spotifyApi.getCurrentUsersProfile))

app.get("/me/playlists", (c) =>
  serverGetData(c, spotifyApi.getListOfCurrentUsersPlaylists)
)

app.get("/playlists/:playlist_id/tracks", (c) =>
  getApiDataWithParam(c, spotifyApi.getPlaylistTrack, "playlist_id")
)

app.post("/logout", logout)

export const GET = handle(app)
export const POST = handle(app)
