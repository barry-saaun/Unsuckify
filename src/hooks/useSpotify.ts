import Error from "next/error"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import useIsAuthenticated from "./useIsAuthenticated"

export function useSpotify<T>(serverEndpoint: string) {
  const { isAuthenticated } = useIsAuthenticated()

  return useQuery<T, Error>({
    queryKey: [serverEndpoint],
    enabled: isAuthenticated === true,
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api${serverEndpoint}`)
        return data
      } catch (error) {
        console.error(error)
      }
    }
  })
}
