"use client"
import Link from "next/link"
import { Button } from "./ui/button"
import useIsAuthenticated from "@/hooks/useIsAuthenticated"

const HeroSection = () => {
  const { isAuthenticated } = useIsAuthenticated()
  return (
    <main className="flex-1 flex justify-center items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48  flex justify-center items-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 md:space-y-6">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter ">
                Your{" "}
                <span className="text-green-500 dark:text-green-400">
                  Spotify
                </span>{" "}
                Playlist Sucks? Let&apos;s unsuck it.
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 sm:text-lg md:text-xl dark:text-gray-400">
                Transform your <span className="font-bold">mid</span> spotify
                playlist to JSON format and received songs recommendation from
                AI.
              </p>
              <div className="py-10 md:py-16">
                <Button className="px-8 py-6">
                  {isAuthenticated ? (
                    <Link
                      href="/dashboard"
                      className="text-sm md:text-xl   font-bold"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="text-sm md:text-xl   font-bold"
                    >
                      Get Started
                    </Link>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HeroSection
