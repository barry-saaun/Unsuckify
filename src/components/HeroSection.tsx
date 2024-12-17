const HeroSection = () => {
  return (
    <main className="flex-1 ">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48  flex justify-center items-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 md:space-y-5">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Your{" "}
                <span className="text-green-500 dark:text-green-400">
                  Spotify
                </span>{" "}
                Playlist Sucks? Let&apos;s unsuck it.
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Transform your favourite spotify playlist to JSON format and
                received songs recommendation from AI.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HeroSection
