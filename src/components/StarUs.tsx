import { Github } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { Button } from "./ui/button"

const StarUs = () => {
  return (
    <HoverCard openDelay={75}>
      <HoverCardTrigger asChild>
        <Button variant={"ghost"} className="h-9 w-9">
          <Github fill="white" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-24 flex items-center justify-center py-2 px-1">
        Star Us
      </HoverCardContent>
    </HoverCard>
  )
}

export default StarUs
