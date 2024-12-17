import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const publicRoute = ["/api/login", "/api/callback"]

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoute.includes(path)

  const cookieStore = await cookies()
  const access_token = cookieStore.get("accessToken")?.value

  if (isPublicRoute && access_token !== undefined) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  return NextResponse.next()
}
