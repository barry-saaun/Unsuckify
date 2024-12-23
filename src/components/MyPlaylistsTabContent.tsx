import useFetchPlaylistsMetadata from "@/hooks/useFetchPlaylistsMetadata"
import PlaylistCard from "./PlaylistCard"
import PlaylistImagePlaceholder from "../../public/playlist_image_placeholder.svg"
import CardSkeleton from "./CardSkeleton"

const MyPlaylistsTabContent = () => {
  const { metadata: PlaylistMetadata, isLoading } = useFetchPlaylistsMetadata()
  const numberOfSkeleton = 6
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading
        ? Array.from({ length: numberOfSkeleton }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))
        : PlaylistMetadata.items.map((item) => {
            return (
              <PlaylistCard
                key={item.id}
                playlistImg={item.url || PlaylistImagePlaceholder}
                owner={item.display_name}
                playlistName={item.name}
                numberOfTracks={item.total}
                playlistId={item.id}
              />
            )
          })}
    </div>
  )
}

export default MyPlaylistsTabContent
