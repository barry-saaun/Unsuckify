import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { ThemeProvider as NextThemeProvider } from "@/components/theme-provider"
import Providers from "./providers"
import NavBar from "@/components/Navbar"
import AuthCheck from "@/components/AuthCheck"
import { cookies } from "next/headers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "🥟 UNSUCKify",
  description: "Unsuck your favourite playlist."
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const access_token = await cookies()

  const isAuthenticated = !!access_token

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black `}
      >
        <AuthCheck isAuthenticated={isAuthenticated}>
          <Providers>
            <NextThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NavBar />
              {children}
            </NextThemeProvider>
          </Providers>
        </AuthCheck>
      </body>
    </html>
  )
}
