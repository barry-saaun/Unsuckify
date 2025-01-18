import { useQuery } from "@tanstack/react-query"
import useIsAuthenticated from "./useIsAuthenticated"
import axios from "axios"
import { PlaylistTrackResponse } from "spotify-api"
import { TrackObjectFull } from "spotify-api"
import { getAccessToken } from "@/lib/services/spotify"

const LIMIT = 100

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const SPOTIFY_BASE = "https://api.spotify.com/v1"

export async function fetchTracks(playlist_id: string, isServerSide = false) {
  try {
    const access_token = await getAccessToken()

    let offset = 0
    let allTracks: (TrackObjectFull | null)[] = []

    const URL = isServerSide ? SPOTIFY_BASE : `${BASE_URL}/api`
    const serverSideAxiosConfig = {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }

    while (true) {
      const REQ_URL = `${URL}/playlists/${playlist_id}/tracks?offset=${offset}&limit=${LIMIT}`

      const res = isServerSide
        ? await axios.get(REQ_URL, serverSideAxiosConfig)
        : await axios.get(REQ_URL)

      const data = res.data as PlaylistTrackResponse

      const tracks = data.items
        .map((item) => (item.is_local ? null : item.track))
        .filter((track) => track !== null) // Filter out null values

      allTracks = [...allTracks, ...tracks]

      if (!data.next) {
        break
      }

      offset += LIMIT
    }

    console.log("All tracks fetched: ", allTracks)
    return allTracks
  } catch (error: any) {
    console.error("Error in fetchTracks:", error.message)
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
    } else if (error.request) {
      console.error("No response received:", error.request)
    } else {
      console.error("Axios error configuration:", error.config)
    }
    throw new Error("Unable to fetch tracks")
  }
}

export function usePlaylistData(playlist_id: string) {
  const { isAuthenticated } = useIsAuthenticated()
  return useQuery({
    queryKey: ["tracks", playlist_id],
    queryFn: () => fetchTracks(playlist_id),
    enabled: isAuthenticated === true
  })
}
