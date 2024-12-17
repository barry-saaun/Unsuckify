import { getAuthEndpointUrl, getOAuthCode } from "@/lib/auth/getAuthCode"
import { logout } from "@/lib/auth/utils"
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

app.get("/me", (c) => serverGetData(c, spotifyApi.getCurrentUser))

app.post("/logout", logout)

export const GET = handle(app)
export const POST = handle(app)
