import React, { useEffect, useState } from "react"
import { Suspense, lazy } from "react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { fetchPaginatedRecommendedTracks } from "@/lib/services/api-utils/tracks"
import { QueryKeyObjectType } from "@/types/index"
import { useInView } from "react-intersection-observer"
import axios from "axios"

const Recommendations: React.FC = () => {
  const [batchCount, setBatchCount] = useState(1)
  const { playlist_id } = useParams<{ playlist_id: string }>()

  const { data, error, fetchNextPage, status, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["tracks", { playlist_id, batchCount }] as [
        string,
        QueryKeyObjectType
      ],
      queryFn: fetchPaginatedRecommendedTracks,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 0
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
