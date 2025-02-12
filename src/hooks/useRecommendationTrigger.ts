import axios from "axios"
import { useEffect, useState } from "react"

export default function useRecommendationTrigger(playlist_id: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [isRequested, setIsRequested] = useState(false)

  useEffect(() => {
    const triggerRecommendationsInsert = async () => {
      // make sure that the hook is only call once
      if (isRequested) return

      try {
        const { data } = await axios.get(`/api/recommendations/${playlist_id}`)

        setIsRequested(true)
        return data
      } catch (error) {
        console.error("[dashboard]: error fetching recommendations endpoint")
      } finally {
        setIsLoading(false)
      }
    }
    triggerRecommendationsInsert()
  }, [playlist_id, isRequested])

  console.log("[useRecommendationTrigger]: data pushed on load ")

  const requestRecommendations = () => {
    if (!isRequested) {
      setIsRequested(true)
      setIsLoading(true)
      axios
        .get(`/api/recommendations/${playlist_id}`)
        .finally(() => setIsLoading(false))
    }
  }

  return { isRecommendationsLoading: isLoading, requestRecommendations }
}
