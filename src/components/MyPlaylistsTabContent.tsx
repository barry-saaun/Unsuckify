import useFetchPlaylistsMetadata from "@/hooks/useFetchPlaylistsMetadata"
import PlaylistCard from "./PlaylistCard"

const MyPlaylistsTabContent = () => {
  const {
    metadata: PlaylistMetadata,
    isLoading,
    error
  } = useFetchPlaylistsMetadata()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PlaylistMetadata.items.map((item) => {
        console.log(
          item.url ? item.url : "https://placehold.co/600x600?text=No+Image"
        )
        return (
          <PlaylistCard
            key={item.id}
            playlistImg={
              item.url || "https://placehold.co/600x600?text=No+Image"
            }
            owner={item.display_name}
            playlistName={item.name}
            numberOfTracks={item.total}
          />
        )
      })}
    </div>
  )
}

export default MyPlaylistsTabContent
