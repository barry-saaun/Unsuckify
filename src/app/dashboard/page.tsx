"use client"

import MyPlaylistsTabContent from "@/components/MyPlaylistsTabContent"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="mx-10 py-10 space-y-5 ">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Your Playlists
        </h1>
        <Tabs defaultValue="my-playlists">
          <TabsList>
            <TabsTrigger value="my-playlists" className="font-bold">
              My Playlists
            </TabsTrigger>
            <TabsTrigger value="public-playlist" className="font-bold">
              Public Playlist
            </TabsTrigger>
          </TabsList>
          <TabsContent value="my-playlists">
            <MyPlaylistsTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
