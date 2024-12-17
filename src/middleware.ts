import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const publicRoute = ["/api/login", "/api/callback", "/login"]

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoute.includes(path)

  const cookiesStore = await cookies()
  const authenticated = cookiesStore.has("access_token")

  if (isPublicRoute && authenticated) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  return NextResponse.next()
}
