"use client"
import { CodeBlockBreakpointValues } from "@/constants/dynamicBreakpointValues"
import useDynamicBreakpointValue from "@/hooks/useDynamicBreakpointValue"
import React, { useState, useEffect, useRef } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism"

export type CodeGenerationProps = {
  fullCode: string
  renderMsPerBatch: number
  batchSize: number
}

const CodeGenerationEffect = ({
  fullCode,
  renderMsPerBatch,
  batchSize
}: CodeGenerationProps) => {
  const [code, setCode] = useState("")
  const { value: codeFontSize } = useDynamicBreakpointValue(
    CodeBlockBreakpointValues
  )
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setCode((prev) => prev + fullCode.slice(index, index + batchSize))
      index += batchSize
      if (index >= fullCode.length) {
        clearInterval(interval)
      }

      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    }, renderMsPerBatch)
    return () => clearInterval(interval)
  }, [fullCode, renderMsPerBatch, batchSize])

  return (
    <div
      ref={containerRef}
      style={{
        maxHeight: "400px", // Define scrollable height
        overflowY: "auto", // Enable vertical scrolling
        borderRadius: "2px"
      }}
    >
      <SyntaxHighlighter
        language="json"
        style={nightOwl}
        wrapLines
        wrapLongLines
        showLineNumbers
        lineProps={{
          style: {
            flexWrap: "wrap",
            fontSize: codeFontSize
          }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeGenerationEffect
