"use client"
import { useSpotify } from "@/hooks/useSpotify"
import { SpotifyUser } from "@/types"

export default function DashboardPage() {
  const { data: userInfo, isLoading, error } = useSpotify<SpotifyUser>("me")

  if (isLoading) return <div>Loading...</div> // Show loading state

  if (error) return <p>Error</p>
  if (!userInfo) return <div>No user data available</div> // Handle case with no user data

  return (
    <div>
      <h1>Hello, Welcome {userInfo.display_name}</h1>
      <div>Your Email: {userInfo.email}</div>
      <div>{JSON.stringify(userInfo)}</div>
    </div>
  )
}
