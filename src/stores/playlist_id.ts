import { create } from "zustand"

interface PlaylistsIdState {
  playlistsId: string[]
  processedData: Set<string> // Keep track of processed playlist IDs
  add_playlistId: (data: { items: { id: string }[] }) => void
  clear: () => void
}

const usePlaylistsIdStore = create<PlaylistsIdState>()((set, get) => ({
  playlistsId: [],
  processedData: new Set(),
  add_playlistId: (data) => {
    if (!data?.items) {
      console.error("Invalid playlist data:", data)
      return
    }

    const newIds = data.items.map((playlist) => playlist.id)
    const { processedData, playlistsId } = get()

    // Filter out already processed IDs
    const idsToAdd = newIds.filter((id) => !processedData.has(id))

    if (idsToAdd.length === 0) {
      return
    }

    // Update the store with new IDs
    set(() => ({
      playlistsId: [...playlistsId, ...idsToAdd],
      processedData: new Set([...processedData, ...idsToAdd])
    }))
  },
  clear: () => set({ playlistsId: [], processedData: new Set() })
}))

export default usePlaylistsIdStore
