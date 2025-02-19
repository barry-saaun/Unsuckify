import React, { useEffect, useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { fetchPaginatedRecommendedTracks } from "@/lib/services/api-utils/tracks"
import { useInView } from "react-intersection-observer"
import { PaginatedQueryKeyType } from "@/types/index"

const Recommendations: React.FC = () => {
  const { playlist_id } = useParams<{ playlist_id: string }>()

  const { data, error, fetchNextPage, status, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["tracks", { playlist_id }] as PaginatedQueryKeyType,
      queryFn: fetchPaginatedRecommendedTracks,
      initialPageParam: { batch: 1, page: 1 },
      getNextPageParam: (lastPage) => lastPage.nextPage
    })

  console.log(data)

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage])

  return status === "pending" ? (
    <div>Loading...</div>
  ) : status === "error" ? (
    <div>{error.message}</div>
  ) : (
    <div className="flex flex-col gap-2">
      {data.pages.map((page) => {
        return (
          <div
            key={`${page.currentPage.batch} - ${page.currentPage.page}`}
            className="flex flex-col gap-2"
          >
            {page.tracks.map((track, i) => {
              return (
                <div key={i} className="rounded-md bg-bg-gray-700 p-4">
                  {track}
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
