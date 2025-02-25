"use server"

import { checkUserOwnerShip } from "@/lib/auth/checkUserOwnership"

export async function checkOwnership(playlist_id: string) {
  return await checkUserOwnerShip(playlist_id)
}
