import {
  SinglePlaylistResponse,
  type CurrentUsersProfileResponse,
  type ListOfCurrentUsersPlaylistsResponse,
  type PlaylistTrackResponse
} from "spotify-api"
import { cookies } from "next/headers"
import { SpotifyFetchReturnType } from "@/types/index"

export async function getAccessToken() {
  const cookiesStore = await cookies()
  return cookiesStore.get("access_token")?.value
}

async function spotifyFetch<T>(
  endpoint: string,
  params?: Record<string, string>
): SpotifyFetchReturnType<T> {
  try {
    const access_token = await getAccessToken()

    if (!access_token) {
      return { success: false, error: "Access Token is missing or invalid" }
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

    console.log(url)

    if (!res.ok) {
      console.error(`Error fetching data: ${res.statusText}`)
      return { success: false, error: `Error: ${res.status} ${res.statusText}` }
    }

    const data = await res.json()
    return data as T
  } catch (error) {
    console.error(error)
    return { success: false, error: `Error in fetching Spotify Data` }
  }
}

export const spotifyApi = {
  getCurrentUsersProfile: () =>
    spotifyFetch<CurrentUsersProfileResponse>("/me"),
  getListOfCurrentUsersPlaylists: () =>
    spotifyFetch<ListOfCurrentUsersPlaylistsResponse>("/me/playlists"),
  getSinglePlaylistResponse: (playlist_id: string) =>
    spotifyFetch<SinglePlaylistResponse>("/playlists/{playlist_id}", {
      playlist_id
    }),
  getPlaylistTrack: (playlist_id: string) =>
    spotifyFetch<PlaylistTrackResponse>("/playlists/{playlist_id}/tracks", {
      playlist_id
    })
}
