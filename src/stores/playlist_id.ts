import { create } from "zustand"
import { ListOfCurrentUsersPlaylistsResponse } from "spotify-api"

interface PlaylistsIdState {
  playlistsId: string[]
  add_playlistId: (data: ListOfCurrentUsersPlaylistsResponse) => void
}

const usePlaylistsIdStore = create<PlaylistsIdState>()((set) => ({
  playlistsId: [],
  add_playlistId: (data) =>
    set((state) => ({
      playlistsId: [
        ...new Set([
          ...state.playlistsId,
          ...data.items.map((playlist) => playlist.id)
        ])
      ]
    }))
}))

export default usePlaylistsIdStore
