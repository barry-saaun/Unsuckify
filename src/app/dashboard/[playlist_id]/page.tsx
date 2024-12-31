"use client"
import PlaylistJsonDataScroll from "@/components/PlaylistJsonDataScroll"
import RecommendationDashboardTab from "@/components/RecommendationDashboardTab"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToastBreakpointValues } from "@/constants/dynamicBreakpointValues"
import useDynamicBreakpointValue from "@/hooks/useDynamicBreakpointValue"
import { usePlaylistData } from "@/hooks/usePlaylistData"
import { useSpotify } from "@/hooks/useSpotify"
import {
  modifiedDataAllTracksPlaylistTrackResponse,
  setCodeGenRenderTime
} from "@/lib/utils"
import { ModifiedDataType } from "@/types/index"
import { CheckCircle2, ChevronLeft, Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Bounce, toast, ToastContainer } from "react-toastify"
import { SinglePlaylistResponse } from "spotify-api"

const PlaylistContentDashboard = () => {
  const { playlist_id } = useParams<{ playlist_id: string }>()

  const { data: playlist_data, isLoading: playlistLoading } =
    useSpotify<SinglePlaylistResponse>(`/playlists/${playlist_id}`, 60 * 1000)

  const { data, isLoading } = usePlaylistData(playlist_id)

  const router = useRouter()

  const [isCopied, setIsCopied] = useState<boolean>(false)
  const { value: toastWidth } = useDynamicBreakpointValue(ToastBreakpointValues)

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
  const predefinedPrompt = `Given the following JSON object with the artists' names, album names, and track names: \n\n ${playlistJson} \n\n Recommend some songs (up to 10) that match the vibe, genre, or emotional tone of these tracks. The recommendations should not be limited to the same artists but should focus on similar musical styles, themes, or atmospheres.`

  const handleCopy = () => {
    window.focus()
    navigator.clipboard.writeText(predefinedPrompt)
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
        <TabsContent value="recommendation">
          <RecommendationDashboardTab modifiedData={modifiedData} />
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
