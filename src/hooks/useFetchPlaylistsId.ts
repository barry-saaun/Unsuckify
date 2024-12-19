"use client"
import { useEffect, useMemo } from "react"
import { useSpotify } from "./useSpotify"
import usePlaylistsIdStore from "@/stores/playlist_id"
import { ListOfCurrentUsersPlaylistsResponse } from "spotify-api"

const useFetchPlaylistsId = () => {
  const { data, isLoading, error } =
    useSpotify<ListOfCurrentUsersPlaylistsResponse>("/me/playlists")

  const playlistsId = usePlaylistsIdStore((state) => state.playlistsId)
  const add_playlistId = usePlaylistsIdStore((state) => state.add_playlistId)
  const clear = usePlaylistsIdStore((state) => state.clear)

  // Memoize the add_playlistId function to ensure it doesn't trigger re-renders
  const stableAddPlaylistId = useMemo(() => add_playlistId, [add_playlistId])

  useEffect(() => {
    if (data) stableAddPlaylistId(data)
  }, [data, stableAddPlaylistId])

  return { playlistsId, isLoading, error, clear }
}
export default useFetchPlaylistsId
