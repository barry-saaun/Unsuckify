import { Check, CheckCircle2Icon, Plus } from "lucide-react"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { HTMLAttributes, useState } from "react"
import { spotifyApi } from "@/lib/services/spotify"
import { Spinner } from "./Icons"

interface DynamicRecommendedTrackCardProps
  extends HTMLAttributes<HTMLDivElement> {
  isOwned: boolean
  isImageLoaded: boolean
  image_src?: string
  track_name: string
  artist_name: string
  tooltipContent: string
  cardClassName?: string
  isSelected?: boolean
  playlist_id: string
  track_uri: string
}

/**
 * `isOwned` prop is needed to render `CardFooter`
 */
const DynamicRecommendedTrackCard = ({
  isOwned,
  isImageLoaded,
  image_src,
  track_name,
  artist_name,
  tooltipContent,
  cardClassName,
  isSelected,
  playlist_id,
  track_uri,
  ...props
}: DynamicRecommendedTrackCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAdded, setIsAdded] = useState<boolean>(false)

  const handleAddTrackToOwnedPlaylist = async () => {
    try {
      setIsLoading(true)
      await spotifyApi.addItemsToPlaylist(playlist_id, {
        uris: [track_uri]
      })

      setIsAdded(true)

      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "backdrop-blur-sm transition-all duration-300 bg-card/50",
              cardClassName
            )}
            {...props}
          >
            <CardContent className="aspect-square relative group overflow-hidden">
              {isImageLoaded ? (
                <Image
                  fill
                  src={image_src ?? "@/public/image_playlist_placeholder.svg"}
                  alt={track_name}
                  priority
                  className="object-cover shadow rounded-t-xl group-hover:brightness-50 group-hover:shadow-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-t-xl" />
              )}
              {isSelected && (
                <div className="absolute top-2 right-2 transition-all bg-black rounded-full p-1 ">
                  <Check className="animate-jump-in animate-once animate-duration-[400ms] animate-ease-linear h-4 w-4" />
                </div>
              )}
            </CardContent>
            <CardHeader>
              <CardTitle className="line-clamp-1">{track_name}</CardTitle>
              <CardDescription>{artist_name}</CardDescription>
            </CardHeader>
            {isOwned ? (
              <CardFooter>
                <Button
                  className="w-full flex justify-center items-center gap-4 mx-5 font-semibold "
                  onClick={handleAddTrackToOwnedPlaylist}
                >
                  {isLoading ? (
                    <Spinner />
                  ) : isAdded ? (
                    <CheckCircle2Icon className="transition-all  animate-jump-in animate-ease-out" />
                  ) : (
                    <>
                      <Plus />
                      {"Add to Playlist"}
                    </>
                  )}
                </Button>
              </CardFooter>
            ) : null}
          </Card>
        </TooltipTrigger>
        <TooltipContent
          className="h-8 w-full px-6 flex justify-center items-center text-sm bg-gray-100  text-gray-800 dark:bg-slate-900 dark:text-white"
          sideOffset={10}
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default DynamicRecommendedTrackCard
