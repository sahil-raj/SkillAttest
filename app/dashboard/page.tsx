"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/components/wallet-provider"
import AttestationForm from "@/components/attestation-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const { isConnected, address } = useWallet()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("attest")

  // Mock data for attestations
  const [myAttestations, setMyAttestations] = useState([
    { id: 1, skill: "Solidity", from: "0x1234...5678", date: "2023-05-10" },
    { id: 2, skill: "React", from: "0xabcd...efgh", date: "2023-04-22" },
  ])

  const [attestationsGiven, setAttestationsGiven] = useState([
    { id: 1, skill: "Smart Contract Auditing", to: "0x9876...5432", date: "2023-05-15" },
    { id: 2, skill: "Frontend Development", to: "0xijkl...mnop", date: "2023-05-01" },
  ])

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your on-chain identity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-violet-500 to-indigo-500 w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
                  {address?.substring(2, 4).toUpperCase()}
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-medium mt-4">Wallet Address</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 break-all">{address}</p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-2">Skills Attested</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                    >
                      Solidity
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                    >
                      React
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                    >
                      Web3
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="attest" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-8 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md">
              <TabsTrigger value="attest">Attest Skills</TabsTrigger>
              <TabsTrigger value="history">Attestation History</TabsTrigger>
            </TabsList>

            <TabsContent value="attest" className="mt-0">
              <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader>
                  <CardTitle>Attest Skills</CardTitle>
                  <CardDescription>Verify and attest skills for other wallet addresses</CardDescription>
                </CardHeader>
                <CardContent>
                  <AttestationForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader>
                  <CardTitle>Attestation History</CardTitle>
                  <CardDescription>View your attestation history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Skills Attested to You</h3>
                      <div className="space-y-3">
                        {myAttestations.map((attestation) => (
                          <div
                            key={attestation.id}
                            className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <Badge className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 mb-2">
                                  {attestation.skill}
                                </Badge>
                                <p className="text-sm text-gray-500 dark:text-gray-400">From: {attestation.from}</p>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{attestation.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-4">Skills You've Attested</h3>
                      <div className="space-y-3">
                        {attestationsGiven.map((attestation) => (
                          <div
                            key={attestation.id}
                            className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <Badge className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 mb-2">
                                  {attestation.skill}
                                </Badge>
                                <p className="text-sm text-gray-500 dark:text-gray-400">To: {attestation.to}</p>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{attestation.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
