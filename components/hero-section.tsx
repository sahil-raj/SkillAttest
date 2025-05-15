import { Badge } from "@/components/ui/badge"

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center text-center space-y-6 py-16">
      <Badge
        variant="outline"
        className="px-4 py-1 text-sm font-medium bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full"
      >
        Web3 Skill Attestation
      </Badge>
      <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
        Attest Skills on Chain
      </h1>
      <p className="max-w-2xl text-xl text-gray-600 dark:text-gray-300">
        Connect your wallet, attest skills for others, and build your on-chain reputation in the decentralized
        ecosystem.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
        {[
          {
            title: "Connect Wallet",
            description: "Securely authenticate with your Ethereum wallet",
          },
          {
            title: "Attest Skills",
            description: "Verify and attest skills for other wallet addresses",
          },
          {
            title: "Build Reputation",
            description: "Grow your on-chain reputation through attestations",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
