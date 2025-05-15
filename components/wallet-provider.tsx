"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createPublicClient, http, createWalletClient, custom } from "viem"
import { mainnet } from "viem/chains"

interface WalletContextType {
  address: string | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  publicClient: ReturnType<typeof createPublicClient> | null
  walletClient: ReturnType<typeof createWalletClient> | null
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  publicClient: null,
  walletClient: null,
})

export const useWallet = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [publicClient, setPublicClient] = useState<ReturnType<typeof createPublicClient> | null>(null)
  const [walletClient, setWalletClient] = useState<ReturnType<typeof createWalletClient> | null>(null)

  useEffect(() => {
    // Initialize public client
    const client = createPublicClient({
      chain: mainnet,
      transport: http(),
    })
    setPublicClient(client)

    // Check if previously connected
    const savedAddress = localStorage.getItem("walletAddress")
    if (savedAddress) {
      setAddress(savedAddress)
      setIsConnected(true)

      if (window.ethereum) {
        const wallet = createWalletClient({
          chain: mainnet,
          transport: custom(window.ethereum),
        })
        setWalletClient(wallet)
      }
    }
  }, [])

  const connect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or another Ethereum wallet")
      return
    }

    try {
      const wallet = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum),
      })

      const [userAddress] = await wallet.requestAddresses()

      setAddress(userAddress)
      setWalletClient(wallet)
      setIsConnected(true)

      localStorage.setItem("walletAddress", userAddress)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setWalletClient(null)
    setIsConnected(false)
    localStorage.removeItem("walletAddress")
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        connect,
        disconnect,
        publicClient,
        walletClient,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
