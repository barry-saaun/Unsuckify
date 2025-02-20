import useSpotifyTrackSearch from "@/hooks/useSpotifyTrackSearch"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import Image from "next/image"
import { useEffect, useState } from "react"
import {
  TooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip"

type OwnedRecommendedTrackCardProps = {
  track_detail: string
  handleCardClick: (track_uri: string) => void
}

const OwnedRecommendedTrackCard = ({
  handleCardClick,
  track_detail
}: OwnedRecommendedTrackCardProps) => {
  const [__, artist_name, track_name, _] = track_detail.split(" - ")
  const { data, isLoading } = useSpotifyTrackSearch(track_detail)

  const [isImageLoaded, setIsImageLoaded] = useState(false)

  useEffect(() => {
    if (data?.album_image) {
      setIsImageLoaded(true)
    }
  }, [data?.album_image])

  const handleClick = () => {
    console.log(data?.track_uri)
    handleCardClick(data?.track_uri ?? "")
  }

  if (!data && !isLoading) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Card className="hover:scale-[1.025] transition-transform duration-100">
              <div className="aspect-square relative bg-gray-200 rounded-t-xl">
                <Image src="@/public/image_playlist_placeholder.svg" alt="" />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1 text-gray-500">
                  No Data
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Track Not Found
                </CardDescription>
              </CardHeader>
            </Card>
          </TooltipTrigger>
          <TooltipContent
            className="h-10 w-full px-6 flex justify-center items-center text-sm"
            sideOffset={10}
          >
            Track Not Found
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Card
            className="hover:scale-[1.025] transition-transform duration-100"
            onClick={handleClick}
          >
            <div className="aspect-square relative">
              {isImageLoaded ? (
                <Image
                  fill
                  src={
                    data?.album_image ??
                    "@/public/image_playlist_placeholder.svg"
                  }
                  alt={track_name}
                  priority
                  className="object-cover shadow rounded-t-xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-t-xl" />
              )}
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{track_name}</CardTitle>
              <CardDescription>{artist_name}</CardDescription>
            </CardHeader>
          </Card>
        </TooltipTrigger>
        <TooltipContent
          className="h-8 w-full px-6 flex justify-center items-center text-sm bg-gray-100  text-gray-800 dark:bg-slate-900 dark:text-white"
          sideOffset={10}
        >
          Click to Select
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
export default OwnedRecommendedTrackCard
