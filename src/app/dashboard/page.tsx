"use client"
import { useSpotify } from "@/hooks/useSpotify"
import usePlaylistsIdStore from "@/stores/playlist_id"
import { ListOfCurrentUsersPlaylistsResponse } from "spotify-api"

export default function DashboardPage() {
  const { data, isLoading, error } =
    useSpotify<ListOfCurrentUsersPlaylistsResponse>("/me/playlists")

  const playlistId = usePlaylistsIdStore((state) => state.playlistsId)
  const add_playlistId = usePlaylistsIdStore((state) => state.add_playlistId)

  // useEffect(() => {
  //   if (data) {
  //     add_playlistId(data)
  //   }
  // }, [playlistId, add_playlistId, data])

  if (isLoading) return <div>Loading...</div> // Show loading state

  if (error) return <p>Error</p>

  return (
    <div>{data?.items.map((item) => <div key={item.name}>{item.id}</div>)}</div>
  )
}
