import { useState } from "react"
import Error from "next/error"

import { useQuery } from "@tanstack/react-query"
import { Context } from "hono"
import axios from "axios"

export function useSpotify<T>(endpoint: string) {
  return useQuery<T, Error>({
    queryKey: [endpoint],
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
