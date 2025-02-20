import { getAccessToken } from "@/lib/auth/utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { TrackSearchResponse } from "spotify-api"

function replaceSpaceWithPlus(str: string): string {
  return str.replace(" ", "+")
}

const useSpotifyTrackSearch = (track_detail: string) => {
  return useQuery({
    queryKey: ["track", track_detail],
    queryFn: async () => {
      try {
        const access_token = await getAccessToken()

        if (!access_token) {
          throw new Error("Access Token is missing or invalid")
        }
        const [album_name, artist_name, track_name, year] =
          track_detail.split(" - ")

        const query = `album:${replaceSpaceWithPlus(album_name)};artist:${replaceSpaceWithPlus(artist_name)};track:${replaceSpaceWithPlus(track_name)};year:${year}`

        const url = `https://api.spotify.com/v1/search?type=track&q=${query}`

        const { data } = await axios.get<TrackSearchResponse>(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
          }
        })

        const track_uri = data.tracks.items[0].uri
        const album_image = data.tracks.items[0].album.images[0].url

        return { track_uri, album_image }
      } catch (error) {
        throw new Error("[useSpotifyTrackSearch]: error parsing data")
      }
    }
  })
}

export default useSpotifyTrackSearch
