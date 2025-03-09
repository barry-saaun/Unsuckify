import { cookies } from "next/headers"

export async function getUserId() {
  const cookiesStore = await cookies()
  const userId = cookiesStore.get("userId")?.value

  return userId
}
