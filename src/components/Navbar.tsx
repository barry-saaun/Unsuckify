"use client"
import Link from "next/link"
import React from "react"

import { Disc2 } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import AuthButton from "./AuthButton"
import StarUs from "./StarUs"

const NavBar: React.FC = () => {
  return (
    <header className="flex flex-row justify-between items-center px-4 py-4">
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
    </header>
  )
}

export default NavBar
