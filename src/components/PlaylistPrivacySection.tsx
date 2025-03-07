import { Globe, Lock } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

interface PlaylistPrivacySectionProps {
  isPublic: boolean
  onPrivacyChange: (isPublic: boolean) => void
}

const PlaylistPrivacySection = ({
  isPublic,
  onPrivacyChange
}: PlaylistPrivacySectionProps) => {
  console.log(`isPublic: ${isPublic}`)

  const HELPER_TEXT = isPublic
    ? "Your playlist will be visible to everyone."
    : "Only you can see this playlist."

  return (
    <div className="flex flex-col space-y-5">
      <div role="group" className="flex rounded-md shadow-sm ">
        <button
          type="button"
          className={cn(
            "px-4 py-2 text-sm font-medium border rounded-l-lg focus:z-10 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out flex items-center justify-center gap-2",
            isPublic
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-blue-500 border-gray-300 hover:bg-blue-50"
          )}
          onClick={() => onPrivacyChange(true)}
          aria-pressed={isPublic}
        >
          <Globe className="w-4 h-4" />
          <h1 className={cn(isPublic ? "font-bold" : "font-normal")}>Public</h1>
        </button>
        <button
          type="button"
          className={cn(
            "px-4 py-2 text-sm font-medium border rounded-r-lg focus:z-10 focus:ring-2 focus:ring-green-500 transition-all duration-200 ease-in-out flex items-center justify-center gap-2",
            !isPublic
              ? "bg-green-500 text-white border-green-500"
              : "bg-white text-green-500 border-gray-300 hover:bg-green-50"
          )}
          onClick={() => onPrivacyChange(false)}
          aria-pressed={!isPublic}
        >
          <Lock className="w-4 h-4" />
          <h1 className={cn(!isPublic ? "font-bold" : "font-normal")}>
            Private
          </h1>
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">{HELPER_TEXT}</p>
    </div>
  )
}

export default PlaylistPrivacySection
