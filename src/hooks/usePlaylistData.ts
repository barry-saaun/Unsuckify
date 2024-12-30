import { useQuery } from "@tanstack/react-query"
import useIsAuthenticated from "./useIsAuthenticated"
import axios from "axios"
import { PlaylistTrackResponse } from "spotify-api"
import { TrackObjectFull } from "spotify-api"

const LIMIT = 100

async function fetchTracks(playlist_id: string) {
  try {
    let offset = 0

    let allTracks: (TrackObjectFull | null)[] = []

    while (true) {
      const res = await axios.get(
        `/api/playlists/${playlist_id}/tracks?offset=${offset}&limit=${LIMIT}`
      )

      const data = res.data as PlaylistTrackResponse

      data.items.map((item) => {
        const trackObj = item.track
        if (!item.is_local) {
          allTracks = [...allTracks]
        }

        allTracks = [...allTracks, trackObj]
      })

      if (!data.next) {
        break
      }

      offset += LIMIT
    }

    return allTracks
  } catch (error) {
    console.error(error)
  }
}

export function usePlaylistData(playlist_id: string) {
  const { isAuthenticated } = useIsAuthenticated()
  return useQuery({
    queryKey: ["tracks"],
    queryFn: () => fetchTracks(playlist_id),
    enabled: isAuthenticated === true
  })
}
