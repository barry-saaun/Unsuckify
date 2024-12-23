import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import axios from "axios"
import useIsAuthenticated from "./useIsAuthenticated"

export function useSpotify<T>(serverEndpoint: string, staleTime?: number) {
  const { isAuthenticated } = useIsAuthenticated()

  const queryOptions: UseQueryOptions<T, Error> = {
    queryKey: [`/api/${serverEndpoint}`],
    enabled: isAuthenticated === true,
    // conditionally include staleTime
    ...(staleTime !== undefined && { staleTime }),
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api${serverEndpoint}`)
        return data
      } catch (error) {
        console.error(error)
      }
    }
  }

  return useQuery<T, Error>(queryOptions)
}
