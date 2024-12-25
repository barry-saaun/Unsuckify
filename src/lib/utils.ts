import { clsx, type ClassValue } from "clsx"
import { SinglePlaylistResponse } from "spotify-api"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function getInitials(name: string) {
  const words = name.split(" ")
  let initials = ""
  words.forEach((word) => (initials += word[0].toUpperCase()))
  return initials
}

export function modifiedSinglePlaylistResponse(data: SinglePlaylistResponse) {
  let modifiedData: Record<string, string | undefined>[] = []

  if (data && data.tracks && data.tracks.items.length > 0) {
    const items = data.tracks.items
    for (const item of items) {
      const track = item.track

      const artistsList = track?.artists
      let artists = ""

      if (artistsList && artistsList.length > 0) {
        artists = artistsList.map((artist) => artist.name).join(", ")
      }

      modifiedData = [
        ...modifiedData,
        {
          artists,
          album: track?.album.name,
          track: track?.name
        }
      ]
    }
  }

  console.log(modifiedData)
  return modifiedData
}
