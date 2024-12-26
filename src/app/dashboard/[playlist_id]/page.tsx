"use client"
import PlaylistJsonDataScroll from "@/components/PlaylistJsonDataScroll"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSpotify } from "@/hooks/useSpotify"
import {
  modifiedSinglePlaylistResponse,
  setCodeGenRenderTime
} from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { SinglePlaylistResponse } from "spotify-api"

const PlaylistContentDashboard = () => {
  const { playlist_id } = useParams<{ playlist_id: string }>()

  const { data, isLoading } = useSpotify<SinglePlaylistResponse>(
    `/playlists/${playlist_id}`,
    60 * 1000
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  let modifiedData: Record<string, string | undefined>[] = []

  let renderMsPerBatch: number = 0
  let batchSize: number = 0

  if (data) {
    modifiedData = modifiedSinglePlaylistResponse(data)

    const dataLength = modifiedData.length
    const timeConfig = setCodeGenRenderTime(dataLength)

    renderMsPerBatch = timeConfig.renderMsPerBatch
    batchSize = timeConfig.batchSize
  }

  return (
    <div className="container  mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 px-3 md:px-0">{data?.name}</h1>
      <Tabs defaultValue="json">
        <TabsList className="space-x-3">
          <TabsTrigger value="recommendation" className="font-bold">
            Recommendation
          </TabsTrigger>
          <TabsTrigger value="json" className="font-bold">
            JSON Data
          </TabsTrigger>
        </TabsList>
        <TabsContent value="json">
          <PlaylistJsonDataScroll
            fullCode={JSON.stringify(modifiedData, null, 2)}
            renderMsPerBatch={renderMsPerBatch}
            batchSize={batchSize}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PlaylistContentDashboard
