import {
  SinglePlaylistResponse,
  type CurrentUsersProfileResponse,
  type ListOfCurrentUsersPlaylistsResponse,
  type PlaylistTrackResponse
} from "spotify-api"
import { OffsetLimitParams, SpotifyFetchResponse } from "@/types/index"
import queryString from "query-string"
import { getAccessToken } from "../auth/utils"
import { assertError } from "../utils"
import axios from "axios"

async function spotifyFetch<T>(
  endpoint: string,
  params?: Record<string, string>,
  queryParams?: Record<string, number | string>
): Promise<SpotifyFetchResponse<T>> {
  try {
    const access_token = await getAccessToken()

    if (!access_token) {
      return assertError("Access Token is missing or invalid", 401)
    }

    const baseUrl = "https://api.spotify.com/v1"

    const resolvedEndpoint = params
      ? Object.keys(params).reduce(
          (url, key) => url.replace(`{${key}}`, params[key]),
          endpoint
        )
      : endpoint

    const queryParamsString = queryParams
      ? `?${queryString.stringify(queryParams)}`
      : ""

    const url = `${baseUrl}${resolvedEndpoint}${queryParamsString}`

    const res = await axios.get(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      }
    })

    if (res.status !== 200) {
      console.error(`Error fetching data: ${res.statusText}`)
      return assertError(`Error: ${res.status} ${res.statusText}`, 500)
    }

    return res.data as T
  } catch (error) {
    console.error(error)
    return assertError("Error in fetching Spotify Data", 500)
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
    }),

  getPlaylistTrackWithQueryParams: (
    playlist_id: string,
    queryParams: OffsetLimitParams
  ) =>
    spotifyFetch<PlaylistTrackResponse>(
      "/playlists/{playlist_id}/tracks",
      {
        playlist_id
      },
      queryParams
    )
}
