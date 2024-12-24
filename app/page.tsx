import { BackgroundProvider } from '@/components/background'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { WorkSection } from '@/components/work-section'

export default function Page() {
  return (
    <BackgroundProvider>
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <main>
        <Hero />
        <WorkSection />
        <div className="h-96" />
      </main>
    </div>
    </BackgroundProvider>
  )
}

