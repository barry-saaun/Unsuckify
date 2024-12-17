import { Context } from "hono"
import { generateRandomString } from "../utils"
import queryString from "query-string"
import axios from "axios"

import { cookies } from "next/headers"

const CLIENT_ID = process.env.CLIENT_ID || ""
const CLIENT_SECRET = process.env.CLIENT_SECRET || ""
const REDIRECT_URI = process.env.REDIRECT_URI || ""

export function getAuthEndpointUrl(c: Context) {
  try {
    const state = generateRandomString(16)

    const scope =
      "playlist-read-private playlist-read-collaborative user-read-private user-read-email"

    const baseUrl = "https://accounts.spotify.com/authorize"
    const params = {
      response_type: "code",
      client_id: CLIENT_ID,
      scope,
      redirect_uri: REDIRECT_URI,
      state
    }

    const queryParamsString = queryString.stringify(params)

    const url = `${baseUrl}?${queryParamsString}`
    return c.redirect(url)
  } catch (error) {
    console.error(error)
    return c.json({ error: "Internal server error" }, 500)
  }
}

export async function getOAuthCode(c: Context) {
  const { code, state, error } = c.req.query()

  if (state === null) {
    return c.redirect("/#" + queryString.stringify({ error: "state_mismatch" }))
  }

  if (error) {
    return c.json({ error })
  }

  try {
    const tokenEndpoint = "https://accounts.spotify.com/api/token"
    // const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    )

    const { data } = await axios({
      url: tokenEndpoint,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`
      },
      params: {
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code"
      }
    })

    const { access_token, expires_in, refresh_token } = data
    const cookiesData = {
      access_token,
      expires_at: Date.now() + expires_in * 1000,
      refresh_token
    }

    const cookiesStore = await cookies()

    for (const [key, value] of Object.entries(cookiesData)) {
      cookiesStore.set(key, value, {
        httpOnly: true,
        secure: true,
        maxAge: expires_in
      })
    }

    // return c.redirect("/?success=true")
    return c.redirect("/dashboard")
  } catch (error) {
    return c.redirect("/?error=token_error")
  }
}
