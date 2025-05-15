import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <HeroSection />
        <div className="mt-12 flex justify-center">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-medium px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Launch App
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
