import PlaylistCard, { PlaylistCardProps } from "./PlaylistCard"

const playlistData: PlaylistCardProps[] = [
  {
    playlistImg: "https://placehold.co/600x400",
    playlistName: "Chill Vibes",
    owner: "Alice",
    numberOfTracks: 42
  },
  {
    playlistImg: "https://placehold.co/600x400",
    playlistName: "Workout Mix",
    owner: "Spotify",
    numberOfTracks: 25
  },
  {
    playlistImg: "https://placehold.co/600x400",
    playlistName: "Throwback Hits",
    owner: "Bob",
    numberOfTracks: 58
  },
  {
    playlistImg: "https://placehold.co/600x400",
    playlistName: "Study Playlist",
    owner: "Charlie",
    numberOfTracks: 34
  },
  {
    playlistImg: "https://placehold.co/600x400",
    playlistName: "Party Bangers",
    owner: "Spotify",
    numberOfTracks: 60
  },
  {
    playlistImg: "https://placehold.co/600x400",
    playlistName: "Indie Favorites",
    owner: "Emma",
    numberOfTracks: 20
  },
  {
    playlistImg: "https://placehold.co/600x400",
    playlistName: "Rock Legends",
    owner: "Spotify",
    numberOfTracks: 45
  },
  {
    playlistImg: "https://placehold.co/600x400",
    playlistName: "Jazz Classics",
    owner: "Noah",
    numberOfTracks: 30
  },
  {
    playlistImg: "https://placehold.co/600x400",
    playlistName: "Top 50 Global",
    owner: "Spotify",
    numberOfTracks: 50
  },
  {
    playlistImg: "https://placehold.co/600x400",
    playlistName: "Focus Music",
    owner: "Olivia",
    numberOfTracks: 1
  }
]

const MyPlaylistsTabContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {playlistData.map((playlist) => (
        <PlaylistCard
          key={playlist.playlistName}
          playlistImg={playlist.playlistImg}
          owner={playlist.owner}
          numberOfTracks={playlist.numberOfTracks}
          playlistName={playlist.playlistName}
        />
      ))}
    </div>
  )
}

export default MyPlaylistsTabContent
