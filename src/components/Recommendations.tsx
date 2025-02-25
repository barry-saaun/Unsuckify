import React, { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchPaginatedRecommendedTracks } from "@/lib/services/api-utils/tracks"
import { PaginatedQueryKeyType } from "@/types/index"
import OwnedRecommendedTrackCard from "./OwnedRecommendedTrackCard"
import { Button } from "./ui/button"
import { Spinner } from "./Icons"
import { Info } from "lucide-react"
import { useTheme } from "next-themes"

type RecommendationsProps = {
  playlist_id: string
  isOwned: boolean
}

const Recommendations = ({ playlist_id, isOwned }: RecommendationsProps) => {
  const { theme } = useTheme()

  const [selectedTrack, setSelectedTrack] = useState(new Set<string>())
  const [isHovered, setIsHovered] = useState(false)

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["tracks", { playlist_id }] as PaginatedQueryKeyType,
      queryFn: fetchPaginatedRecommendedTracks,
      initialPageParam: { batch: 1, page: 1 },
      getNextPageParam: (lastPage) => lastPage.nextPage
    })

  const handleCardClick = (track_uri: string) => {
    setSelectedTrack((prev) => {
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

  console.log(selectedTrack)

  console.log(`isOwned:`, isOwned)

  return (
    <div className="container  mx-auto flex flex-col gap-2 justify-center items-center min-h-screen ">
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
            <OwnedRecommendedTrackCard
              playlist_id={playlist_id}
              handleCardClick={handleCardClick}
              track_detail={track}
              key={`${i}-${track}`}
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
