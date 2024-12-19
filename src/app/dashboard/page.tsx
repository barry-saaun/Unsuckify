"use client"
import { useSpotify } from "@/hooks/useSpotify"
import usePlaylistsIdStore from "@/stores/playlist_id"
import { ListOfCurrentUsersPlaylistsResponse } from "spotify-api"

export default function DashboardPage() {
  const { data, isLoading, error } =
    useSpotify<ListOfCurrentUsersPlaylistsResponse>("/me/playlist")

  const playlistId = usePlaylistsIdStore((state) => state.playlistsId)
  const add_playlistId = usePlaylistsIdStore((state) => state.add_playlistId)

  if (!data) return <div>No user data available</div> // Handle case with no user data

  add_playlistId(data)

  if (isLoading) return <div>Loading...</div> // Show loading state

  if (error) return <p>Error</p>

  return <div>{JSON.stringify(playlistId)}</div>
}
