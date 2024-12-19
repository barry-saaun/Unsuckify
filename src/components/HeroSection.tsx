"use client"
import Link from "next/link"
import useIsAuthenticated from "@/hooks/useIsAuthenticated"
import { Highlight } from "./ui/hero-highlight"
import { HoverBorderGradient } from "./ui/hover-border-gradient"

const HeroSection = () => {
  const { isAuthenticated } = useIsAuthenticated()
  return (
    <main className="flex-1 flex justify-center items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48  flex justify-center items-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 md:space-y-6">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-relaxed ">
                Your{" "}
                <span className="text-green-500 dark:text-green-400">
                  Spotify
                </span>{" "}
                Playlist Sucks?
                <Highlight isBlock>Let&apos;s unsuck it.</Highlight>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 sm:text-lg md:text-xl dark:text-gray-400">
                Transform your <span className="font-bold">mid</span> spotify
                playlist to JSON format and received songs recommendation from
                AI.
              </p>
              <div className="py-10 md:py-16 flex justify-center items-center">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                >
                  {isAuthenticated ? (
                    <Link
                      href="/dashboard"
                      className="text-sm md:text-xl   font-thin"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="text-sm md:text-xl   font-thin"
                    >
                      Get Started
                    </Link>
                  )}
                </HoverBorderGradient>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HeroSection
