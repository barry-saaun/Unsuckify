import { clsx, type ClassValue } from "clsx"
import { TrackObjectFull } from "spotify-api"
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

export function modifiedDataAllTracksPlaylistTrackResponse(
  data: (TrackObjectFull | null)[]
): ModifiedDataType {
  let modifiedData: ModifiedDataType = []

  if (data && data.length > 0) {
    for (const track of data) {
      let artists = ""
      if (track && track.artists && track.artists.length > 0) {
        artists = track.artists.map((artist) => artist.name).join(", ")
      }

      if (!artists) {
        continue
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

    case dataLength > 200:
      renderMsPerBatch = 0.25
      batchSize = 500
      break
  }
  return { renderMsPerBatch, batchSize }
}

export function convertModifiedDataToString(
  modifiedData: ModifiedDataType
): string[] {
  let TracksStringArray: string[] = []

  for (const data of modifiedData) {
    TracksStringArray = [
      ...TracksStringArray,
      `${data.artists}-${data.track}-${data.album} `
    ]
  }

  return TracksStringArray
}
