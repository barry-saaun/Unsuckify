import React, { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchPaginatedRecommendedTracks } from "@/lib/services/api-utils/tracks"
import { PaginatedQueryKeyType } from "@/types/index"
import RecommendedTrackCard from "./RecommendedTrackCard"
import { Button } from "./ui/button"
import { Spinner } from "./Icons"
import { Info } from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useDebounce } from "@uidotdev/usehooks"
import { Card, CardContent } from "./ui/card"
import PlaylistPrivacySection from "./PlaylistPrivacySection"

type RecommendationsProps = {
  playlist_id: string
  isOwned: boolean
}

const Recommendations = ({ playlist_id, isOwned }: RecommendationsProps) => {
  const { theme } = useTheme()

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["tracks", { playlist_id }] as PaginatedQueryKeyType,
      queryFn: fetchPaginatedRecommendedTracks,
      initialPageParam: { batch: 1, page: 1 },
      getNextPageParam: (lastPage) => lastPage.nextPage
    })

  const [newPlaylistName, setNewPlaylistName] = useState("")
  const debouncedNewPlaylistName = useDebounce(newPlaylistName, 300)

  const [selectedTracks, setSelectedTracks] = useState(
    new Set<string>(new Set())
  )

  const [isPublic, setIsPublic] = useState(true)

  const handleNotIsOwnedCardClick = (track_uri: string) => {
    setSelectedTracks((prev) => {
      const newTrackUri = new Set(prev)

      // handle select and deselect logic
      if (newTrackUri.has(track_uri)) {
        newTrackUri.delete(track_uri)
      } else {
        newTrackUri.add(track_uri)
      }

      return newTrackUri
    })
  }

  console.log(selectedTracks)
  console.log(debouncedNewPlaylistName)

  return (
    <div className="container  mx-auto flex flex-col gap-2 justify-center items-center min-h-screen border-none ">
      {!isOwned && (
        <Card className="mb-8 w-full">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-2xl font-bold mb-6">Create New Playlist</h2>
            <div>
              <Label
                htmlFor="playlist-name"
                className="text-sm font-semibold mb-2 block"
              >
                Playlist Name
              </Label>
              <Input
                id="playlist-name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name"
                className="w-full"
              />
            </div>
            <PlaylistPrivacySection
              isPublic={isPublic}
              onPrivacyChange={setIsPublic}
            />
            <Button
              className="w-full font-semibold disabled:cursor-not-allowed"
              disabled={!newPlaylistName}
            >
              Create New Playlist
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="w-3/4 h-12 my-5 px-3 bg-[#EEF2FD] dark:bg-[#19244B] rounded-md flex justify-start items-center gap-4">
        {theme === "dark" ? (
          <Info stroke="#9CABF8" size={14} />
        ) : (
          <Info stroke="#556BC8" size={14} />
        )}

        <h1 className="text-[#556BC8] dark:text-[#9CABF8] text-sm font-[500]">
          Click on a song card to select or deselect if for your new playlist.
        </h1>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 ">
        {data?.pages.flatMap((page) =>
          page.tracks.map((track, i) => (
            <RecommendedTrackCard
              key={`${i}-${track}`}
              playlist_id={playlist_id}
              handleNotIsOwnedCardClick={handleNotIsOwnedCardClick}
              track_detail={track}
              isOwned={isOwned}
            />
          ))
        )}
      </div>
      {hasNextPage ? (
        <Button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="self-center mt-5 w-32"
        >
          {isFetchingNextPage ? (
            <Spinner />
          ) : (
            <h1 className="font-semibold text-sm tracking-normal">Load More</h1>
          )}
        </Button>
      ) : null}
    </div>
  )
}

export default Recommendations
