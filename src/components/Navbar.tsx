"use client"
import Link from "next/link"
import React from "react"

import { Disc2 } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import AuthButton from "./AuthButton"
import StarUs from "./StarUs"

const NavBar: React.FC = () => {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 justify-between items-center px-4 py-4">
          <Link
            href="/"
            className="flex flex-row justify-center items-center gap-1"
          >
            <Disc2 className="text-primary" />
            <span className="font-bold text-xl text-primary">UNSUCKify</span>
          </Link>
          <div className="flex flex-row gap-1 justify-center items-center">
            <StarUs />
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
