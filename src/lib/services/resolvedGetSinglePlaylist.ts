import { Context } from "hono"
import { spotifyApi } from "./spotify"
import { serverGetData } from "./serverGetData"

export async function resolvedGetSinglePlaylist(c: Context) {
  try {
    const playlist_id = c.req.param("playlist_id")
    const data = await spotifyApi.getSinglePlaylistData(playlist_id)

    if ("ErrMsg" in data) {
      // Return an error response in the expected format
      return c.json({ error: data.ErrMsg }, 400)
    }

    // Pass the valid response to `serverGetData`
    return serverGetData(c, () => Promise.resolve(data))
  } catch (err) {
    console.error("Error fetching playlist data:", err)
    return c.json({ error: "An unexpected error occurred" }, 500)
  }
}
