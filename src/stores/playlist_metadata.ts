import { ListOfCurrentUsersPlaylistsResponse } from "spotify-api"
import { create } from "zustand"

interface PlaylistsMetadataState {
  metadata: {
    items: Array<{
      id: string
      description: string
      url: string
      name: string
      display_name: string
      total: number
    }>
  }
  processedData: Set<string>
  add_metadata: (data: ListOfCurrentUsersPlaylistsResponse) => void
  clear: () => void
}

const usePlaylistsMetadataStore = create<PlaylistsMetadataState>()(
  (set, get) => ({
    metadata: { items: [] },
    processedData: new Set<string>(),
    add_metadata: (data) => {
      if (!data?.items) {
        console.error("Invalid playlist data", data)
        return
      }

      const formattedData = data.items.map((item) => ({
        id: item.id,
        description: item.description || "",
        url: item.images?.[0]?.url || "",
        name: item.name,
        display_name: item.owner.display_name || "",
        total: item.tracks.total
      }))

      const { metadata, processedData } = get()

      // Ensure processedData is always a Set<string>
      const existingProcessedData = processedData || new Set<string>()

      const newItems = formattedData.filter(
        (item) => !existingProcessedData?.has(item.id)
      )

      if (newItems.length === 0) {
        return
      }

      set(() => ({
        metadata: { items: [...metadata.items, ...newItems] },
        processedData: new Set([
          ...existingProcessedData,
          ...newItems.map((item) => item.id)
        ])
      }))
    },
    clear: () => set({ metadata: { items: [] }, processedData: new Set() })
  })
)

export default usePlaylistsMetadataStore
