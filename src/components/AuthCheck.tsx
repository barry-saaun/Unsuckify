"use client"

import React, { useEffect, useState } from "react"
import { Spinner } from "./Icons"

type AuthCheckProps = {
  isAuthenticated: boolean
  children: React.ReactNode
}

export default function AuthCheck({
  children,
  isAuthenticated
}: AuthCheckProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedOut, setIsLoggedOut] = useState(false)

  useEffect(() => {
    setIsLoading(false)
    setIsLoggedOut(!isAuthenticated)
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black dark:bg-black">
        <Spinner />
      </div>
    )
  }

  if (isLoggedOut) {
    return (
      <div>
        <p>You are logged out.</p>
        {children} {/* Still render the children */}
      </div>
    )
  }

  return <>{children}</>
}
