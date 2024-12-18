import type { CurrentUsersProfileResponse } from "spotify-api"
import axios from "axios"
import { cookies } from "next/headers"

export async function getAccessToken() {
  const cookiesStore = await cookies()
  return cookiesStore.get("access_token")?.value
}

export async function spotifyFetch<T>(
  endpoint: string
): Promise<T | { ErrMsg: string }> {
  try {
    const access_token = await getAccessToken()

    if (!access_token) {
      return { ErrMsg: "Access token is missing or invalid" }
    }

    const baseUrl = "https://api.spotify.com/v1"
    const url = `${baseUrl}${endpoint}`

    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })

    return data as T
  } catch (error) {
    console.error(error)
    return { ErrMsg: "Error in Fetching spotify data" }
  }
}

export const spotifyApi = {
  getCurrentUsersProfile: () => spotifyFetch<CurrentUsersProfileResponse>("/me")
}
