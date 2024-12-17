import { useEffect, useState } from "react"
import Error from "next/error"

import { useQuery } from "@tanstack/react-query"
import { Context } from "hono"
import axios from "axios"
import { isAuthenticated } from "@/lib/auth/utils"

export function useSpotify<T>(endpoint: string) {
  const [authenticated, setAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await isAuthenticated()
        setAuthenticated(result)
      } catch (error) {
        console.error("Error in checkAuth:", error)
      }
    }
    checkAuth()
  }, [])

  return useQuery<T, Error>({
    queryKey: [endpoint],
    enabled: authenticated === true,
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
