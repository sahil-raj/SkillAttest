"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { useWallet } from "@/components/wallet-provider"
import { formatAddress } from "@/lib/utils"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { address, connect, disconnect, isConnected } = useWallet()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Attestations", href: "/attestations" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                SkillAttest
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "text-violet-600 dark:text-violet-400"
                        : "text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="bg-violet-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-violet-700 dark:text-violet-300">
                  {formatAddress(address || "")}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="border-violet-200 dark:border-gray-700 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-gray-800"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={connect}
                className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white"
              >
                Connect Wallet
              </Button>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full mr-2"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="space-y-2 pb-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-gray-800"
                    : "text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {isConnected ? (
              <div className="flex flex-col gap-2">
                <div className="bg-violet-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-violet-700 dark:text-violet-300 text-center">
                  {formatAddress(address || "")}
                </div>
                <Button
                  variant="outline"
                  onClick={disconnect}
                  className="border-violet-200 dark:border-gray-700 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-gray-800"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  connect()
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
