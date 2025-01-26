import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { match } from "path-to-regexp"

const publicRoutes = ["/api/login", "/api/callback", "/login"]
const protectedRoutes = [
  "/dashboard",
  "/dashboard/:playlist_id",
  "/api/me",
  "/api/me/playlist",
  "/api/playlists/:playlist_id/tracks",
  "/api/recommendations/:playlist_id"
]

// Helper function to check if path matches any patterns
const matchesRoute = (patterns: string[], path: string) =>
  patterns.some((pattern) =>
    match(pattern, { decode: decodeURIComponent })(path)
  )

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  const isPublicRoute = matchesRoute(publicRoutes, path)
  const isProtectedRoute = matchesRoute(protectedRoutes, path)

  const cookiesStore = await cookies()
  const authenticated = cookiesStore.has("access_token")

  if (isPublicRoute && authenticated) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  if (isProtectedRoute && !authenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  return NextResponse.next()
}
