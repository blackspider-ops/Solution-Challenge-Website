import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { SponsorsGrid } from "./sponsors-grid"

async function getSponsors() {
  const sponsors = await db.sponsor.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  })
  
  return {
    platinum: sponsors.filter(s => s.tier === "platinum"),
    gold: sponsors.filter(s => s.tier === "gold"),
    silver: sponsors.filter(s => s.tier === "silver"),
  }
}

export async function SponsorsSection() {
  const sponsors = await getSponsors()
  
  return (
    <section id="sponsors" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-primary/10 to-chart-2/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Our Supporters
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Backed by{" "}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We&apos;re grateful to our amazing sponsors who make this event possible and help 
            empower the next generation of innovators.
          </p>
        </div>

        {/* Sponsors by Tier */}
        <SponsorsGrid sponsors={sponsors} />

        {/* Become a Sponsor CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-3xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
            <div className="text-center sm:text-left">
              <p className="text-foreground font-semibold mb-1">Want to support innovation?</p>
              <p className="text-sm text-muted-foreground">Join our sponsors and make a difference</p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-105 transition-all duration-300 group rounded-xl px-6" asChild>
              <a href="mailto:gdg@psu.edu?subject=Solution%20Challenge%20Sponsorship%20Inquiry">
                Become a Sponsor
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
