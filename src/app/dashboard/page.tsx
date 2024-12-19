"use client"
import useFetchPlaylistsId from "@/hooks/useFetchPlaylistsId"

export default function DashboardPage() {
  const { playlistsId, isLoading, error, clear } = useFetchPlaylistsId()

  if (isLoading) return <div className="px-10 py-10">Loading...</div> // Show loading state

  if (error) return <p>Error</p>

  return (
    <div className="flex justify-between px-10 py-10">
      <div>
        {playlistsId.map((id, idx) => (
          <h1 key={idx}>{id}</h1>
        ))}
      </div>
      <button onClick={clear}>Clear</button>
    </div>
  )
}
