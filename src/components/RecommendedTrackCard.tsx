import useSpotifyTrackSearch from "@/hooks/useSpotifyTrackSearch"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import {
  TooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip"
import { cn } from "@/lib/utils"
import DynamicRecommendedTrackCard from "./DynamicRecommendedTrackCard"

type RecommendedTrackCardProps = {
  playlist_id: string
  track_detail: string
  isOwned: boolean
  handleNotIsOwnedCardClick: (track_uri: string) => void
  onAddToPlaylist?: (track_uri: string) => Promise<void>
}

const RecommendedTrackCard = React.memo(
  ({
    playlist_id,
    handleNotIsOwnedCardClick,
    track_detail,
    isOwned
  }: RecommendedTrackCardProps) => {
    const [__, artist_name, track_name, _] = track_detail.split(" - ")
    const { data, isLoading } = useSpotifyTrackSearch(track_detail)

    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [isHovered, setIsHoverd] = useState(false)
    const [isSelected, setIsSelected] = useState(false)

    useEffect(() => {
      if (data?.album_image) {
        setIsImageLoaded(true)
      }
    }, [data?.album_image])

    const handleOnClick = () => {
      handleNotIsOwnedCardClick(data?.track_uri ?? "")
      setIsSelected(!isSelected)
    }

    const tooltipContent: string = isOwned
      ? "Add this to your Playlist"
      : isSelected
        ? "Click to Deselect"
        : "Click to Select"

    if (!data && !isLoading) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card
                className={cn(
                  "hover:scale-[1.025] transition-transform duration-100 bg-card/50"
                )}
              >
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

    const sharedProps = {
      isOwned,
      track_name,
      artist_name,
      image_src: data?.album_image,
      isImageLoaded,
      tooltipContent,
      onMouseEnter: () => setIsHoverd(true),
      onMouseLeave: () => setIsHoverd(false),
      isSelected,
      cardClassName: cn(
        isHovered && "transform-gpu scale-[1.03] shadow-lg",
        !isOwned && isSelected && "ring-2 ring-primary"
      )
    }

    return (
      <DynamicRecommendedTrackCard
        {...sharedProps}
        onClick={!isOwned ? handleOnClick : undefined}
        track_uri={data?.track_uri ?? ""}
        playlist_id={playlist_id}
      />
    )
  }
)
export default RecommendedTrackCard

RecommendedTrackCard.displayName = "RecommendedTrackCard"
