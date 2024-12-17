"use server"
import { Context } from "hono"
import { deleteCookie } from "hono/cookie"
import { cookies } from "next/headers"

export const ServerCheckAuth = async () => {
  const cookiesStore = await cookies()
  return cookiesStore.has("access_token")
}

export const deleteSession = async (c: Context) => {
  const deletedKeys = ["access_token", "expires_at", "refresh_token"]

  // const cookiesStore = getCookie(c)
  deletedKeys.forEach((key) => deleteCookie(c, key))
}

export const logout = async (c: Context) => {
  await deleteSession(c)

  return c.redirect("/")
}
