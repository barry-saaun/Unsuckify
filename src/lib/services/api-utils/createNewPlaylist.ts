import { getAccessToken } from "@/lib/auth/utils"
import { assertError } from "@/lib/utils"
import axios from "axios"
import { CreatePlaylistResponse } from "spotify-api"

type CreateNewPlaylistParams = {
  userId: string
  name: string
  isPublic: boolean
}

export async function createNewPlaylist({
  userId,
  name,
  isPublic
}: CreateNewPlaylistParams) {
  console.log(userId, name, isPublic)
  try {
    const access_token = await getAccessToken()

    if (!access_token) {
      return assertError("Access Token is missing or invalid", 401)
    }

    const requestBody = {
      name,
      public: isPublic
    }

    const res = await axios.post<CreatePlaylistResponse>(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json"
        }
      }
    )

    console.log(res.data)
    return res.data.id
  } catch (error) {
    console.error(error)
  }
}
