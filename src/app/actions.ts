"use server"

import { checkUserOwnerShip } from "@/lib/auth/checkUserOwnership"
import { getUserId } from "@/lib/auth/getUserId"

export async function checkOwnership(playlist_id: string) {
  return await checkUserOwnerShip(playlist_id)
}

export async function getUserIdAction() {
  return await getUserId()
}
