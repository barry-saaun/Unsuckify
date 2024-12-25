"use client"

import { ListOfCurrentUsersPlaylistsResponse } from "spotify-api"
import { useSpotify } from "./useSpotify"
import usePlaylistsMetadataStore from "@/stores/playlist_metadata"
import { useEffect, useMemo } from "react"

const useFetchUserPlaylistsMetadata = () => {
  const { data, isLoading, error } =
    useSpotify<ListOfCurrentUsersPlaylistsResponse>("/me/playlists")

  const metadata = usePlaylistsMetadataStore((state) => state.metadata)
  const add_metadata = usePlaylistsMetadataStore((state) => state.add_metadata)
  const clear = usePlaylistsMetadataStore((state) => state.clear)

  const stableAddMetadata = useMemo(() => add_metadata, [add_metadata])

  useEffect(() => {
    if (data) stableAddMetadata(data)
  }, [data, stableAddMetadata])
  return { metadata, isLoading, error, clear }
}

export default useFetchUserPlaylistsMetadata
