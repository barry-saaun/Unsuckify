import { getAuthEndpointUrl, getOAuthCode } from "@/lib/auth/getAuthCode"
import { logout } from "@/lib/auth/utils"
import { Recommendations } from "@/lib/services/gemini/gemini"
import getApiDataWithParam from "@/lib/services/api-utils/getApiDataWithParam"
import getApiDataWithParamAndQuery from "@/lib/services/api-utils/getApiDataWithParamAndQuery"
import { getSlashMeEndpoint } from "@/lib/services/api-utils/getSlashMeEndpont"
import { serverGetData } from "@/lib/services/api-utils/serverGetData"
import { spotifyApi } from "@/lib/services/spotify"
import { OffsetLimitParams } from "@/types/index"
import { Hono } from "hono"
import { handle } from "hono/vercel"
import { redisSetOwnerId } from "@/lib/services/redis/redisSetOwnerId"
import { fetchCachedTracks } from "@/lib/services/redis/fetchCachedTracks"
import { assertError } from "@/lib/utils"

export const runtime = "edge"

const app = new Hono().basePath("/api")

app.get("/search", (c) => {
  return c.json({ msg: "Hello Hono" })
})

app.get("/login", getAuthEndpointUrl)

app.get("/callback", getOAuthCode)

app.get("/me", (c) => getSlashMeEndpoint(c))

app.get("/me/playlists", (c) =>
  serverGetData(c, spotifyApi.getListOfCurrentUsersPlaylists)
)

app.get("/playlists/:playlist_id", (c) =>
  getApiDataWithParam(c, spotifyApi.getSinglePlaylistResponse, "playlist_id")
)

app.get("/playlists/:playlist_id/tracks", (c) =>
  getApiDataWithParamAndQuery(
    c,
    (playlist_id, queryKeysValues) =>
      spotifyApi.getPlaylistTrackWithQueryParams(
        playlist_id,
        queryKeysValues as OffsetLimitParams
      ),
    "playlist_id",
    ["offset", "limit"]
  )
)

app.get("/recommendations/:playlist_id", Recommendations)

app.get("/getTracks/:playlist_id", async (c) => {
  const playlist_id = c.req.param("playlist_id")
  const queryParams = c.req.query()

  console.log("queryParams: ", queryParams)

  if (!("batch" in queryParams)) {
    return c.json(
      assertError("[server][query] 'batch' query param cannot be found", 400)
    )
  }

  // appreantly queryParams returns {"route": "getTracks"} as well
  const allowedQueries = ["batch", "route"]

  const queryKeys = Object.keys(queryParams)

  if (queryKeys.some((key) => !allowedQueries.includes(key))) {
    return c.json(
      assertError(
        `[server][query] Invalid query parameter(s): ${queryKeys
          .filter((k) => !allowedQueries.includes(k))
          .join(", ")}`,
        400
      )
    )
  }

  const batchCountRaw = queryParams.batch

  const batchCount = parseInt(batchCountRaw, 10)
  const data = await fetchCachedTracks({ playlist_id, batchCount })
  return c.json(data)
})

app.post("/setRedis", redisSetOwnerId)

app.post("/logout", logout)

export const GET = handle(app)
export const POST = handle(app)
