"use server"
import { Context } from "hono"
import { deleteCookie } from "hono/cookie"
import { cookies } from "next/headers"

export const ServerCheckAuth = async () => {
  const cookiesStore = await cookies()
  return cookiesStore.has("access_token")
}

export async function getAccessToken() {
  const hasAccessToken = await ServerCheckAuth()

  if (!hasAccessToken) {
    throw new Error("Access token can't be found in cookies store")
  }

  const cookiesStore = await cookies()
  return cookiesStore.get("access_token")?.value
}

export const deleteSession = async (c: Context) => {
  const deletedKeys = ["access_token", "expires_at", "refresh_token", "userId"]

  deletedKeys.forEach((key) => deleteCookie(c, key))
}

export const logout = async (c: Context) => {
  await deleteSession(c)

  return c.redirect("/")
}
