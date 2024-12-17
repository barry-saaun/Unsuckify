import Error from "next/error"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import useIsAuthenticated from "./useIsAuthenticated"

export function useSpotify<T>(endpoint: string) {
  const { isAuthenticated } = useIsAuthenticated()

  return useQuery<T, Error>({
    queryKey: [endpoint],
    enabled: isAuthenticated === true,
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/${endpoint}`)
        return data
      } catch (error) {
        console.error(error)
      }
    }
  })
}
