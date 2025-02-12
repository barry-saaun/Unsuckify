import React, { useState } from "react"
import { Suspense, lazy } from "react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useTracks } from "@/hooks/useTracks"

const Recommendations: React.FC = () => {
  const [batchCount, setBatchCount] = useState(1)
  const { playlist_id } = useParams<{ playlist_id: string }>()

  const { data } = useTracks({ playlist_id, batchCount })
  console.log(data)

  return <div>{JSON.stringify(data, null, 2)}</div>
}

export default Recommendations
