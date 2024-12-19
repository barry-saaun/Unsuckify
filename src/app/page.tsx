import HeroSection from "@/components/HeroSection"
import NavBar from "@/components/Navbar"

export default function Home() {
  return (
    <div className="min-h-screen  flex flex-col bg-white dark:bg-black ">
      <NavBar />
      <HeroSection />
    </div>
  )
}
