"use client"
import PlaylistJsonDataScroll from "@/components/PlaylistJsonDataScroll"
import RecommendationDashboardTab from "@/components/RecommendationDashboardTab"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TOAST_BREAKPOINT_VALUES } from "@/constants/dynamicBreakpointValues"
import { jsonTabPredefinedPrompt } from "@/constants/geminiPrompts"
import useDynamicBreakpointValue from "@/hooks/useDynamicBreakpointValue"
import { usePlaylistData } from "@/hooks/usePlaylistData"
import useRecommendationTrigger from "@/hooks/useRecommendationTrigger"
import { useSpotify } from "@/hooks/useSpotify"
import {
  modifiedDataAllTracksPlaylistTrackResponse,
  setCodeGenRenderTime
} from "@/lib/utils"
import { ModifiedDataType } from "@/types/index"
import axios from "axios"
import { CheckCircle2, ChevronLeft, Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Bounce, toast, ToastContainer } from "react-toastify"
import { SinglePlaylistResponse } from "spotify-api"

const PlaylistContentDashboard = () => {
  const { playlist_id } = useParams<{ playlist_id: string }>()

  const { data: playlist_data, isLoading: playlistLoading } =
    useSpotify<SinglePlaylistResponse>(`/playlists/${playlist_id}`, 60 * 1000)

  const { data, isLoading } = usePlaylistData(playlist_id)

  const router = useRouter()

  const [isCopied, setIsCopied] = useState<boolean>(false)
  const { value: toastWidth } = useDynamicBreakpointValue(
    TOAST_BREAKPOINT_VALUES
  )

  // push necessary data to @upstash/redis
  useEffect(() => {
    const pushOwnerId = async () => {
      if (!playlist_data?.owner.id || !playlist_id) {
        return
      }

      try {
        const ownerId = playlist_data?.owner.id
        await axios.post(`/api/setRedis`, {
          playlist_id,
          ownerId
        })
      } catch (error) {
        throw new Error()
      }
    }
    pushOwnerId()
  }, [playlist_data, playlist_id])

  const { isRecommendationsLoading, requestRecommendations } =
    useRecommendationTrigger(playlist_id)

  if (isLoading && playlistLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  let modifiedData: ModifiedDataType = []

  let renderMsPerBatch: number = 0
  let batchSize: number = 0

  if (data) {
    modifiedData = modifiedDataAllTracksPlaylistTrackResponse(data)

    const dataLength = modifiedData.length
    const timeConfig = setCodeGenRenderTime(dataLength)

    renderMsPerBatch = timeConfig.renderMsPerBatch
    batchSize = timeConfig.batchSize
  }

  const playlistJson = JSON.stringify(modifiedData, null, 2)

  const handleCopy = () => {
    window.focus()
    navigator.clipboard.writeText(jsonTabPredefinedPrompt(playlistJson))
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
    toast.success("🎉 Copied!", {
      position: "top-center",
      theme: "colored",
      closeOnClick: true,
      transition: Bounce,
      autoClose: 1200
    })
  }

  return (
    <div className="container  mx-auto py-10">
      <Button
        className="mb-5 flex mx-2 group"
        variant="secondary"
        onClick={() => router.push("/dashboard")}
      >
        <ChevronLeft className="group-hover:-translate-x-[0.35rem] transition-transform duration-200" />
        <span className="font-bold">Back to Dashboard</span>
      </Button>
      <h1 className="text-4xl font-bold mb-8 px-3 md:px-0">
        {playlist_data?.name}
      </h1>
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
            fullCode={playlistJson}
            renderMsPerBatch={renderMsPerBatch}
            batchSize={batchSize}
            customButton={
              <Button onClick={handleCopy} className="font-bold h-10 w-28 ">
                {isCopied ? (
                  <div className=" h-8 w-8 flex justify-center items-center animate-check">
                    <CheckCircle2 />
                  </div>
                ) : (
                  <div>Copy JSON</div>
                )}
              </Button>
            }
          />
        </TabsContent>
        <TabsContent value="recommendation" onClick={requestRecommendations}>
          {isRecommendationsLoading ? (
            <div className="flex items-center justify-center h-screen">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <RecommendationDashboardTab />
          )}
        </TabsContent>
      </Tabs>
      <ToastContainer
        toastStyle={{
          width: toastWidth
        }}
      />
    </div>
  )
}

export default PlaylistContentDashboard
