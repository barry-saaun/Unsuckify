"use client"
import { Icons, Spinner } from "@/components/Icons"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"

const LoginPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    setIsLoading(true)
    router.push("/api/login")
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <Button onClick={handleGoBack} className="absolute top-10 left-10 flex ">
        <ChevronLeft />
        <span className="font-medium">Back</span>
      </Button>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center ">
          <h1 className="font-semibold tracking-tight text-2xl">
            Welcome to UNSUCKify
          </h1>
          <p className="text-sm text-muted-foreground">
            Log in with your Spotify acccount to get started
          </p>
        </div>
        <Button
          className=" flex flex-row gap-2 font-semibold  text-white px-4 py-2 rounded-md shadow-md dark:shadow-none bg-[#1DB954] hover:bg-[#1aa34a]"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <Icons.spotify />
              <p>Log in with Spotify</p>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default LoginPage
