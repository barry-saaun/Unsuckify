"use client"
import { useEffect, useState } from "react"
import { BreakpointValues } from "@/types/index"

const useDynamicBreakpointValue = (breakpoint_values: BreakpointValues) => {
  const [value, setValue] = useState<string>("")

  useEffect(() => {
    const updateValue = () => {
      const windowWith = window.innerWidth
      // These breakpoints are by TailwindCSS convention
      // sm
      if (windowWith >= 640 && windowWith < 768) {
        setValue(breakpoint_values.SM)
        // md
      } else if (windowWith >= 768 && windowWith < 1024) {
        setValue(breakpoint_values.MD)
        // lg
      } else if (windowWith >= 1024) {
        setValue(breakpoint_values.LG)

        // i.e., below 640, set as a default value
      } else {
        setValue(breakpoint_values.DEFAULT)
      }
    }

    window.addEventListener("resize", updateValue)
    updateValue()
  }, [breakpoint_values])

  return { value }
}

export default useDynamicBreakpointValue
