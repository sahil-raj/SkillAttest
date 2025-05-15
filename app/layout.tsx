import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { WalletProvider } from "@/components/wallet-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Skill Attestation",
  description: "Attest skills on-chain using your wallet",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <WalletProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              {children}
            </div>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
