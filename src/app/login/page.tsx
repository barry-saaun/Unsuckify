import { Icons } from "@/components/Icons"
import { Button } from "@/components/ui/button"

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center ">
          <h1 className="font-semibold tracking-tight text-2xl">
            Welcome to UNSUCKify
          </h1>
          <p className="text-sm text-muted-foreground">
            Log in with your Spotify acccount to get started
          </p>
        </div>
        <Button className="flex flex-row gap-2 bg-[#1DB954] hover:bg-[#1aa34a] font-semibold  text-white px-4 py-2 rounded-md shadow-md dark:shadow-none">
          <Icons.spotify />
          <p>Log in with Spotify</p>
        </Button>
      </div>
    </div>
  )
}

export default LoginPage
