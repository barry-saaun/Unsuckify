"use client"
import React, { useState, useEffect } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism"

type CodeGenerationProps = {
  fullCode: string
  renderMsPerword?: number
}

const CodeGenerationEffect = ({
  fullCode,
  renderMsPerword = 5
}: CodeGenerationProps) => {
  const [code, setCode] = useState("")

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setCode((prev) => prev + fullCode[index])
      index++
      if (index >= fullCode.length) {
        clearInterval(interval)
      }
    }, renderMsPerword)
    return () => clearInterval(interval)
  }, [fullCode, renderMsPerword])

  return (
    <SyntaxHighlighter
      language="json"
      style={nightOwl}
      wrapLines
      wrapLongLines
      showLineNumbers
      lineProps={{
        style: {
          flexWrap: "wrap"
        }
      }}
    >
      {code}
    </SyntaxHighlighter>
  )
}

export default CodeGenerationEffect
