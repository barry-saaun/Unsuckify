import { Github } from "lucide-react"
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger
} from "./ui/tooltip"
import { Button } from "./ui/button"
import Link from "next/link"

const StarUs = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="https://github.com/barry-saaun/Unsuckify" target="_blank">
            <Button variant={"ghost"} className="h-9 w-9">
              <Github fill="white" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="w-24 flex items-center justify-center py-2 px-1 ">
          Star Us
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default StarUs
