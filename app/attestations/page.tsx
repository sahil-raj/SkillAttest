"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { formatAddress } from "@/lib/utils"

// Mock data for attestations
const mockAttestations = [
  {
    id: 1,
    skill: "Solidity",
    from: "0x1234567890abcdef1234567890abcdef12345678",
    to: "0xabcdef1234567890abcdef1234567890abcdef12",
    date: "2023-05-15",
    description: "Excellent Solidity developer with deep knowledge of security best practices.",
  },
  {
    id: 2,
    skill: "React",
    from: "0x2345678901abcdef2345678901abcdef23456789",
    to: "0xbcdef1234567890abcdef1234567890abcdef123",
    date: "2023-05-10",
    description: "Great React skills, built several complex dApps with clean architecture.",
  },
  {
    id: 3,
    skill: "Smart Contract Auditing",
    from: "0x3456789012abcdef3456789012abcdef34567890",
    to: "0xcdef1234567890abcdef1234567890abcdef1234",
    date: "2023-05-05",
    description: "Thorough auditor who has helped identify critical vulnerabilities in our contracts.",
  },
  {
    id: 4,
    skill: "Web3 Development",
    from: "0x4567890123abcdef4567890123abcdef45678901",
    to: "0xdef1234567890abcdef1234567890abcdef12345",
    date: "2023-04-30",
    description: "Excellent understanding of Web3 stack and blockchain integration patterns.",
  },
  {
    id: 5,
    skill: "UI/UX Design",
    from: "0x5678901234abcdef5678901234abcdef56789012",
    to: "0xef1234567890abcdef1234567890abcdef123456",
    date: "2023-04-25",
    description: "Created beautiful and intuitive interfaces for our dApp that users love.",
  },
]

export default function AttestationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAttestations, setFilteredAttestations] = useState(mockAttestations)

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredAttestations(mockAttestations)
      return
    }

    const lowerCaseSearch = searchTerm.toLowerCase()
    const filtered = mockAttestations.filter(
      (attestation) =>
        attestation.skill.toLowerCase().includes(lowerCaseSearch) ||
        attestation.from.toLowerCase().includes(lowerCaseSearch) ||
        attestation.to.toLowerCase().includes(lowerCaseSearch) ||
        attestation.description.toLowerCase().includes(lowerCaseSearch),
    )

    setFilteredAttestations(filtered)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
            Explore Attestations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse through all the skill attestations on the platform
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Input
              placeholder="Search by skill, address, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
          >
            Search
          </Button>
        </div>

        <div className="space-y-6">
          {filteredAttestations.length > 0 ? (
            filteredAttestations.map((attestation) => (
              <Card
                key={attestation.id}
                className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <Badge className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 mb-2">
                        {attestation.skill}
                      </Badge>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{attestation.date}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">From: </span>
                        <span className="font-medium">{formatAddress(attestation.from)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">To: </span>
                        <span className="font-medium">{formatAddress(attestation.to)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{attestation.description}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No attestations found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
