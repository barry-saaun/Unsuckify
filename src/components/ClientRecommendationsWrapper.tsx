"use client"
import { useEffect, useState } from "react"
import Recommendations from "./Recommendations"
import { Loader2 } from "lucide-react"

import { checkOwnership } from "@/app/actions"

export default function ClientRecommendationsWrapper({
  playlist_id
}: {
  playlist_id: string
}) {
  const [isOwned, setIsOwned] = useState<boolean | null>(null)

  useEffect(() => {
    const fetchOwnership = async () => {
      try {
        const result = await checkOwnership(playlist_id)
        setIsOwned(result)
      } catch (error) {
        console.error("Failed to check ownership:", error)
        setIsOwned(false)
      }
    }

    fetchOwnership()
  }, [playlist_id])

  if (isOwned === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return <Recommendations playlist_id={playlist_id} isOwned={isOwned} />
}
