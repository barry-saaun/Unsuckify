"use client"
import { useState, useEffect } from "react"
import { ServerCheckAuth } from "@/lib/auth/utils"

const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await ServerCheckAuth()
        setIsAuthenticated(res)
      } catch (error) {
        setIsAuthenticated(false)
        console.error("Error in checkAuth:", error)
      }
    }
    checkAuth()
  }, [isAuthenticated])

  const authenticateUser = () => setIsAuthenticated(true)

  const deauthenticateUser = () => setIsAuthenticated(false)

  return { isAuthenticated, authenticateUser, deauthenticateUser }
}

export default useIsAuthenticated
