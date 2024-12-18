import { create } from "zustand"
import { ListOfCurrentUsersPlaylistsResponse } from "spotify-api"

interface PlaylistsIdState {
  playlistsId: string[]
  add_playlistId: (data: ListOfCurrentUsersPlaylistsResponse) => void
}

const usePlaylistIdStore = create<PlaylistsIdState>()((set) => ({
  playlistsId: [""],
  add_playlistId: (data) =>
    set((state) => ({
      playlistsId: [
        ...state.playlistsId,
        ...data.items.map((playlist) => playlist.id)
      ]
    }))
}))

export default usePlaylistIdStore
