import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { WorkSection } from '@/components/work-section'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <WorkSection />
      </main>
    </div>
  )
}

