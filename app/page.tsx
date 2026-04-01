import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TimelineSection } from "@/components/timeline-section"
import { TracksSection } from "@/components/tracks-section"
import { SponsorsSection } from "@/components/sponsors-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TimelineSection />
      <TracksSection />
      <SponsorsSection />
      <FAQSection />
      <Footer />
    </main>
  )
}
