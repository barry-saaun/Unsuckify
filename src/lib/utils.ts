import { clsx, type ClassValue } from "clsx"
import { SinglePlaylistResponse } from "spotify-api"
import { twMerge } from "tailwind-merge"
import { ModifiedDataType } from "../types/index"

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

export function modifiedSinglePlaylistResponse(
  data: SinglePlaylistResponse
): ModifiedDataType {
  let modifiedData: ModifiedDataType = []

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

  return modifiedData
}

export function setCodeGenRenderTime(dataLength: number): {
  renderMsPerBatch: number
  batchSize: number
} {
  let renderMsPerBatch: number = 0
  let batchSize: number = 0

  switch (true) {
    default:
      renderMsPerBatch = 1
      batchSize = 10
      break

    case dataLength <= 10:
      renderMsPerBatch = 10
      batchSize = 2
      break

    case dataLength > 10 && dataLength <= 25:
      renderMsPerBatch = 0.5
      batchSize = 20
      break

    case dataLength > 25 && dataLength <= 40:
      renderMsPerBatch = 1
      batchSize = 40
      break

    case dataLength > 40:
      renderMsPerBatch = 1
      batchSize = 50
      break
  }
  return { renderMsPerBatch, batchSize }
}

export function convertModifiedDataToString(
  modifiedData: ModifiedDataType
): string[] {
  let TracksStringArray: string[] = []
  let idx = 1

  for (const data of modifiedData) {
    TracksStringArray = [
      ...TracksStringArray,
      `${idx}. ${data.artists} - ${data.track} - ${data.album} `
    ]
    idx++
  }

  return TracksStringArray
}
