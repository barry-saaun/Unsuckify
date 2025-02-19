import { GetTracksReturnType, PaginatedQueryKeyType } from "@/types/index"
import { QueryFunctionContext } from "@tanstack/react-query"
import axios from "axios"

type PageParamType = {
  batch: number
  page: number
}

export async function fetchPaginatedRecommendedTracks(
  context: QueryFunctionContext<PaginatedQueryKeyType, PageParamType>
) {
  const [_key, { playlist_id }] = context.queryKey

  const { batch, page } = context.pageParam

  try {
    const { data } = await axios.get<GetTracksReturnType>(
      `/api/getTracks/${playlist_id}?batch=${batch}&page=${page}`
    )

    let nextPage: PageParamType | null = null

    if (page < 5) {
      nextPage = { batch, page: page + 1 }
    } else if (batch === 1) {
      nextPage = { batch: 2, page: 1 }
    } else {
      nextPage = null
    }

    return {
      ...data,
      currentPage: { page, batch },
      nextPage
    }
  } catch (error) {
    throw new Error("error in inf query")
  }
}
