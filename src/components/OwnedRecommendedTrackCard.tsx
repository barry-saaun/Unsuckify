import useSpotifyTrackSearch from "@/hooks/useSpotifyTrackSearch"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import Image from "next/image"

type OwnedRecommendedTrackCardProps = {
  track_detail: string
}

const OwnedRecommendedTrackCard = ({
  track_detail
}: OwnedRecommendedTrackCardProps) => {
  const [__, artist_name, track_name, _] = track_detail.split(" - ")
  const { data } = useSpotifyTrackSearch(track_detail)

  if (!data) return null

  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger>
        <Card className="hover:scale-[1.025] transition-transform duration-100">
          <div className="aspect-square relative">
            <Image
              fill
              src={data?.album_image}
              alt={track_name}
              priority
              className="object-cover shadow rounded-t-xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-1">{track_name}</CardTitle>
            <CardDescription>{artist_name}</CardDescription>
          </CardHeader>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent
        className="h-10 w-full px-6 flex justify-center items-center text-sm"
        sideOffset={10}
      >
        Click to Select
      </HoverCardContent>
    </HoverCard>
  )
}
export default OwnedRecommendedTrackCard
