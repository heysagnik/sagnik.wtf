import FeaturedWork from '@/components/work'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { motion } from 'framer-motion'
import InfiniteMarquee from '@/components/infinite-marquee'
import Footer from '@/components/footer'

export default function Page() {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-screen">
          <Hero />
        </section>

        {/* Work Section (includes Marquee, Projects, and View More) */}
        <section className="relative mt-[10vh]">
          <FeaturedWork />
        </section>
        <Footer/>
      </main>
    </div>
  )
}