import React, { useEffect, useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { fetchPaginatedRecommendedTracks } from "@/lib/services/api-utils/tracks"
import { PaginatedQueryKeyType } from "@/types/index"
import { useInView } from "react-intersection-observer"

const Recommendations: React.FC = () => {
  const [batchCount, setBatchCount] = useState(1)
  const [mergeTracks, setMergeTracks] = useState<string[]>([])
  const { playlist_id } = useParams<{ playlist_id: string }>()

  const { data, error, fetchNextPage, status, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["tracks", { playlist_id }] as PaginatedQueryKeyType,
      queryFn: (context) =>
        fetchPaginatedRecommendedTracks({
          batchCount,
          context
        }),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 0
    })
  console.log(data)

  const { ref, inView } = useInView()

  useEffect(() => {
    if (data?.pages) {
      const newTracks = data.pages.flatMap((page) => page.data)
      setMergeTracks(newTracks)
    }
  }, [data])

  useEffect(() => {
    if (!data?.pages) return

    const lastPage = data.pages[data.pages.length - 1]

    if (lastPage?.isReadyForNextBatch) {
      setBatchCount((prev) => prev + 1)
    }
  }, [data])

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage])

  console.log(`mergeTracks: ${mergeTracks.length}, batchCount: ${batchCount}`)

  return status === "pending" ? (
    <div>Loading...</div>
  ) : status === "error" ? (
    <div>{error.message}</div>
  ) : (
    <div className="flex flex-col gap-2">
      {data.pages.map((page) => {
        return (
          <div key={page.currentPage} className="flex flex-col gap-2">
            {page.data.map((item, i) => {
              return (
                <div key={i} className="rounded-md bg-grayscale-700 p-4">
                  {item}
                </div>
              )
            })}
          </div>
        )
      })}

      <div ref={ref}>{isFetchingNextPage && "Loading..."}</div>
    </div>
  )
}

export default Recommendations
