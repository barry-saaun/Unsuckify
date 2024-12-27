"use client"
import { useEffect, useState } from "react"

const useDynamicToastWidth = () => {
  const [toastWidth, setToastWidth] = useState<string>("300px")

  useEffect(() => {
    const updateWidth = () => {
      const windowWith = window.innerWidth
      if (windowWith < 640) {
        setToastWidth("300px")
      } else if (windowWith >= 640 && windowWith < 768) {
        setToastWidth("300px")
      } else if (windowWith >= 768 && windowWith < 1024) {
        setToastWidth("325px")
      } else if (windowWith >= 1024) {
        setToastWidth("375px")
      }
    }

    window.addEventListener("resize", updateWidth)
    updateWidth()
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  return { toastWidth }
}

export default useDynamicToastWidth
