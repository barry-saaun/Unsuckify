import type {
  CurrentUsersProfileResponse,
  ListOfCurrentUsersPlaylistsResponse,
  SinglePlaylistResponse
} from "spotify-api"
import { cookies } from "next/headers"

export async function getAccessToken() {
  const cookiesStore = await cookies()
  return cookiesStore.get("access_token")?.value
}

async function spotifyFetch<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T | { ErrMsg: string }> {
  try {
    const access_token = await getAccessToken()

    if (!access_token) {
      return { ErrMsg: "Access token is missing or invalid" }
    }

    const baseUrl = "https://api.spotify.com/v1"

    const resolvedEndpoint = params
      ? Object.keys(params).reduce(
          (url, key) => url.replace(`{${key}}`, params[key]),
          endpoint
        )
      : endpoint

    const url = `${baseUrl}${resolvedEndpoint}`

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) {
      console.error(`Error fetching data: ${res.statusText}`)
      return { ErrMsg: `Error: ${res.status} ${res.statusText}` }
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return { ErrMsg: "Error in Fetching spotify data" }
  }
}

export const spotifyApi = {
  getCurrentUsersProfile: () =>
    spotifyFetch<CurrentUsersProfileResponse>("/me"),
  getListOfCurrentUsersPlaylists: () =>
    spotifyFetch<ListOfCurrentUsersPlaylistsResponse>("/me/playlists"),
  getSinglePlaylistData: (playlist_id: string) =>
    spotifyFetch<SinglePlaylistResponse>("/playlists/{playlist_id}", {
      playlist_id
    })
}
