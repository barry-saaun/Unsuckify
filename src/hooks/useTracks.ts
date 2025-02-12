import { fetchCachedTracks } from "@/lib/services/redis/fetchCachedTracks"
import { QueryKeyObjectType } from "@/types/index"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export function useTracks({ playlist_id, batchCount }: QueryKeyObjectType) {
  return useQuery({
    queryKey: ["tracks", { playlist_id, batchCount }],
    queryFn: async ({ queryKey }) => {
      const [_key, params] = queryKey as [string, QueryKeyObjectType]

      const { data } = await axios.get(
        `/api/getTracks/${params.playlist_id}?batch=${params.batchCount}`
      )

      return data
    },
    enabled: !!playlist_id
  })
}
