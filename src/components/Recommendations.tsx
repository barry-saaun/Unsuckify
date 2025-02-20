import React from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { fetchPaginatedRecommendedTracks } from "@/lib/services/api-utils/tracks"
import { PaginatedQueryKeyType } from "@/types/index"
import OwnedRecommendedTrackCard from "./OwnedRecommendedTrackCard"
import { Button } from "./ui/button"
import { Spinner } from "./Icons"
import { Info } from "lucide-react"

const Recommendations: React.FC = () => {
  const { playlist_id } = useParams<{ playlist_id: string }>()

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["tracks", { playlist_id }] as PaginatedQueryKeyType,
      queryFn: fetchPaginatedRecommendedTracks,
      initialPageParam: { batch: 1, page: 1 },
      getNextPageParam: (lastPage) => lastPage.nextPage
    })

  console.log(data)

  return (
    <div className="container  mx-auto flex flex-col gap-2 justify-center items-center min-h-screen ">
      <div className="w-3/4 h-12 m-10 px-3 dark:bg-[#19244B] rounded-md flex justify-start items-center gap-4">
        <Info stroke="#9CABF8 " size={14} />
        <h1 className="text-[#9CABF8] text-sm font-[500]">
          Click on a song card to select or deselect if for your new playlist.
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 ">
        {data?.pages.flatMap((page) =>
          page.tracks.map((track, i) => (
            <OwnedRecommendedTrackCard
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
