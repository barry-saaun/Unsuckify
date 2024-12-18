import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator
} from "./ui/dropdown-menu"
import { DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { LogOutIcon, UserRound } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { CurrentUsersProfileResponse } from "spotify-api"
import { useSpotify } from "@/hooks/useSpotify"
import { cn, getInitials } from "@/lib/utils"
import useIsAuthenticated from "@/hooks/useIsAuthenticated"

const AuthButton = () => {
  const router = useRouter()
  const { data: userInfo, isLoading } = useSpotify<CurrentUsersProfileResponse>("/me")
  const { isAuthenticated, deauthenticateUser } = useIsAuthenticated()

  const handleLogout = async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include"
    })

    if (res.ok) {
      deauthenticateUser()
      router.push("/")
    }
  }

  if (isLoading) {
    return (
      <div className="mx-2">
        <Button disabled className="font-semibold">
          Loading...
        </Button>
      </div>
    )
  }

  return (
    <div className={cn(isAuthenticated && userInfo ? "mx-2" : "")}>
      {isAuthenticated && userInfo ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="w-9 h-9">
            <Button variant="ghost" className="rounded-full">
              <Avatar className="w-8 h-8 ">
                <AvatarImage src={userInfo?.images?.[0]?.url} />
                <AvatarFallback>
                  {getInitials(userInfo?.display_name ?? "")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="px-2">
              <div
                className="flex justify-between items-center gap-10 cursor-pointer"
                onClick={() =>
                  window.open(`https://open.spotify.com/user/${userInfo?.id}`)
                }
              >
                <div className="flex flex-col space-y-[2px]">
                  <h1 className="font-bold text-base tracking-tight">
                    {userInfo?.display_name}
                  </h1>
                  <span className="text-gray-500 dark:text-gray-400 ">
                    {userInfo?.email}
                  </span>
                </div>
                <UserRound className="w-4 h-4 opacity-50" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  )
}

export default AuthButton
