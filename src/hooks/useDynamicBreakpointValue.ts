"use client"
import { useEffect, useState } from "react"

type BreakpointValues = {
  default: string
  sm: string
  md: string
  lg: string
}

const useDynamicBreakpointValue = (breakpoint_values: BreakpointValues) => {
  const [value, setValue] = useState<string>("")

  useEffect(() => {
    const updateValue = () => {
      const windowWith = window.innerWidth
      // These breakpoints are by TailwindCSS convention
      // sm
      if (windowWith >= 640 && windowWith < 768) {
        setValue(breakpoint_values.sm)
        // md
      } else if (windowWith >= 768 && windowWith < 1024) {
        setValue(breakpoint_values.md)
        // lg
      } else if (windowWith >= 1024) {
        setValue(breakpoint_values.lg)

        // i.e., below 640, set as a default value
      } else {
        setValue(breakpoint_values.default)
      }
    }

    window.addEventListener("resize", updateValue)
    updateValue()
  }, [breakpoint_values])

  return { value }
}

export default useDynamicBreakpointValue
